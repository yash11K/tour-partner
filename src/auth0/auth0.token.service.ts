import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { Auth0Config, TokenRequest } from "./auth0.dto";

@Injectable()
export class TokenService {
  private readonly auth0Config: Auth0Config =
    this.configService.get<Auth0Config>('auth0', {
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      grantType: process.env.AUTH0_GRANT_TYPE,
    });
  private readonly tokenUrl: string =
    'https://' + this.auth0Config.domain + '/oauth/token';

  private tokenExpiresAt: Date;
  private token: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigServic,
  ) {}

  public isTokenExpired(): boolean {
    if (!this.tokenExpiresAt) {
      Logger.log(
        'Token has expired, refreshing at :' + Date.now().toLocaleString,
      );
      return true;
    }
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
    const tokenRequest: TokenRequest = {
      clientSecret: this.auth0Config.clientSecret,
      clientId: this.auth0Config.clientId,
      grantType: this.auth0Config.grantType,
      audience:"https://"' + this.auth0Config.domain +"/api/v2/",
    };

    Logger.log('Calling Token API');
    const startTime = Date.now();
    const response = await lastValueFrom(
      this.httpService.post(this.tokenUrl, {
        grant_type: tokenRequest.grantType,
        client_id: tokenRequest.clientId,
        client_secret: tokenRequest.clientSecret,
        audience: tokenRequest.audience,
      }),
    );
    Logger.log(`API call completed in ${Date.now() - startTime} ms`);

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
