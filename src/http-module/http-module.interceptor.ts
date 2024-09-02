import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { TokenService } from 'src/auth0/auth0.token.service';

@Injectable()
export class HttpModuleInterceptor implements OnModuleInit {
  constructor(
    private httpService: HttpService,
    private readonly tokenService: TokenService
  ) { }

  async onModuleInit() {
    let startTime: number;
    let token = 'Bearer ' + await this.tokenService.getToken();
    this.httpService.axiosRef.interceptors.request.use(
      (config) => {
        startTime = Date.now();
        Logger.log(`Request to: ${config.method.toUpperCase()} ${config.url}`);
        config.headers['Authorization'] = token;
        return config;
      },
      (error) => {
        Logger.error('Request error:', error);
        return Promise.reject(error);
      }
    );
    this.httpService.axiosRef.interceptors.response.use(
      (config) => {
        Logger.log(`API call completed in ${Date.now() - startTime} ms`);
        return config
      },
      (error) => {
        Logger.error('Respose error: ', error);
        return Promise.reject(error);
      }
    );
  }
}
