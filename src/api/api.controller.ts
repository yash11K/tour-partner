import { Controller, Get, HttpException, HttpStatus, Logger, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth0/auth0.roles.enum';
import { Auth0Service } from 'src/auth0/auth0.service';
import { ApiService } from './api.service';
import { PermissionsGuard } from 'src/auth';
import { ApiHeader } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller()
export class ApiController {
  constructor(
    private readonly auth0Service: Auth0Service,
    private readonly apiService: ApiService,
  ){}

  @ApiHeader({
    name: 'Authorization'
  })
  @Get('profile')
  getProfile(@Req() req: any): any{
    const permissions: string[] = req.user.permissions;
    const role: ROLES = this.auth0Service.rolesDilator(permissions);
    const userId: string = req.user.userId;   
    if(role == ROLES.SuperAdmin){
      Logger.log('Fetching profile details for user:', userId); 
      return this.apiService.getSuperAdminProfile(userId);
    } else {
      return "Throw permissions not configured error";
    }
  }
}
