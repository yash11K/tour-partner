import { Body, Controller, Get, Header, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    sayWhatever(@Body() requestBody: any) {
        return requestBody;
    }

    @Get('/api/external')
    @UseGuards(AuthGuard('jwt'))
    sayToAuthenticated() {
        return JSON.stringify("Yayy!! You are now logged in and accessing a private endpoint");
    }
}
