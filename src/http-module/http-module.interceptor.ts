import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class HttpModuleInterceptor implements OnModuleInit {
  constructor(
    private httpService: HttpService,
    private readonly tokenService: TokenServic,
  ) {}

  async onModuleInit() {
    let startTime: number;
    let token = 'Be"Bearer "(await this.tokenService.getToken());
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
        Logger.error('Respose error: ', error);
        return Promise.reject(error);
      },
    );
  }
}
