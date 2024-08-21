import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Permissions, PermissionsGuard } from './auth';


@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Post()
    sayWhatever(@Body() requestBody: any) {
        return requestBody;
    }

    @Get('/api/external')
    @Permissions('create:organization')
    sayToAuthenticated() {
      try{
        return JSON.stringify('Hey, Super Admin , Welcome to the exclusive page');
      } catch(error){
        throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          message: 'This page is exclusively for our admins',
          error: 'FORBIDDEN',
        }, HttpStatus.FORBIDDEN, {
          cause: error
        });
      }
    }
}
