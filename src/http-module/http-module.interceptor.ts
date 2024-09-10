import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { TokenService } from '../auth0/auth0.token.service';

@Injectable()
export class HttpModuleInterceptor implements OnModuleInit {
  constructor(
    private httpService: HttpService,
    private readonly tokenService: TokenService,
  ) {}

  async onModuleInit() {
    let startTime: number;
    let token = 'Bearer' + (await this.tokenService.getToken());
    this.httpService.axiosRef.interceptors.request.use(
      async (config) => {
        startTime = Date.now();
        Logger.log(`Request to: ${config.method.toUpperCase()} ${config.url}`);
        if (this.tokenService.isTokenExpired()) {
          token = await this.tokenService.getToken();
        }
        config.headers['Authorization'] = token;
        Logger.log(config.data);
        return config;
      },
      (error) => {
        Logger.error('Request error:', error);
        return Promise.reject(error);
      },
    );
    this.httpService.axiosRef.interceptors.response.use(
      (config) => {
        Logger.log(`API call completed in ${Date.now() - startTime} ms`);
        Logger.log(config.data);
        return config;
      },
      (error) => {
        Logger.error('Response error: ', error);
        return Promise.reject(error);
      },
    );
  }
}
