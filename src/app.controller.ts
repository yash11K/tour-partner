import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Permissions, PermissionsGuard } from './auth';
import {Auth0Service} from "./auth0/auth0.service";


//@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private readonly auth0Service: Auth0Service) { }

    @Get()
    getHello(): string {
        return JSON.stringify(this.appService.getHello());
    }

    @Get('liveness')
    liveness(): string{
        return JSON.stringify('ok => NEW IMAGE');
    }
    @Get('readiness')
    readiness(): string{
        return JSON.stringify('ok => NEW IMAGE');
    }

    @Get('profile/2')
    async profile(): Promise<any>{
       return await this.auth0Service.fetchAllOrganizations();
    }
}
