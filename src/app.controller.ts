import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('liveness')
  liveness(): string {
    return JSON.stringify('ok => NEW IMAGE');
  }

  @Get('readiness')
  readiness(): string {
    return JSON.stringify('ok => NEW IMAGE');
  }
}
