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
    const orgId: string = req.user.orgId;

    if(role == ROLES.SuperAdmin){
      Logger.log('Fetching profile details for SuperAdmin', userId); 
      return this.apiService.getSuperAdminProfile(userId,ROLES[role]);
    } else if (role == ROLES.Admin) {
      Logger.log('Fetching profile details for Admin', userId); 
      return this.apiService.getAdminProfile(userId, orgId, ROLES[role]);

    } else {
      return "Throw permissions not configured error" + ROLES[role];
    }
  }
}
