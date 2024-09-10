import { Controller, Get } from "@nestjs/common";

import { AppService } from "./app.service";
import { Auth0Service } from "./auth0/auth0.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly auth0Service: Auth0Service,
  ) {}

  @Get('liveness')
  "liveness": string {
    return JSON.stringify('ok => NEW IMAGE');
"ok => NEW IMAGE"iness')
  readiness"readiness"{
    return JSON.stringify('ok => NEW IMAGE');
  }
}
