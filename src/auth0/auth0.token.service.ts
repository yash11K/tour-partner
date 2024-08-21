import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TokenService {
  private tokenExpiresAt: Date;
  private token: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private isTokenExpired(): boolean {
    if (!this.tokenExpiresAt) return true;
    return Date.now() >= this.tokenExpiresAt.getTime() - 5000; //extra 5s for buffer
  }

  async getToken(): Promise<string> {
    // Check if the token is still valid
    if (this.tokenExpiresAt && this.tokenExpiresAt.getTime() > Date.now()) {
      return this.getStoredToken();
    }

    // Fetch a new token
    const token = await this.fetchToken();
    this.tokenExpiresAt = new Date(Date.now() + Number(token.expiresIn) * 1000);
    return token.accessToken;
  }

  private async fetchToken(): Promise<{
    accessToken: string;
    expiresIn: string;
  }> {
    const auth0Config = this.configService.get<{
      clientId: string;
      clientSecret: string;
      grantType: string;
      domain: string;
    }>('auth0');

    const tokenRequest: TokenRequest = new TokenRequest();
    tokenRequest.clientSecret = auth0Config.clientSecret;
    tokenRequest.clientId = auth0Config.clientId;
    tokenRequest.grantType = auth0Config.grantType;
    tokenRequest.managementAudience =
      'https://' + auth0Config.domain + '/api/v2/';

    const tokenUrl: string = 'https://' + auth0Config.domain + '/auth/token/';

    const response = await lastValueFrom(
      this.httpService.post(tokenUrl, {
        grant_type: tokenRequest.grantType,
        client_id: tokenRequest.clientId,
        client_secret: tokenRequest.grantType,
        audience: tokenRequest.managementAudience,
      }),
    );

    this.tokenExpiresAt = response.data.expires_in;
    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
    };
  }

  private async getStoredToken(): Promise<string> {
    if (!this.token || this.isTokenExpired()) {
      const token = await this.fetchToken();
      this.token = token.accessToken;
    }
    return this.token;
  }
}
