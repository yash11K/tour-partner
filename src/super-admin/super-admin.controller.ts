import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Permissions, PermissionsGuard } from 'src/auth';

@UseGuards(AuthGuard('jwt'), PermissionsGuard) 
@Controller('profile')
export class SuperAdminController {

  @Get()
  getSuperAdmin(@Req() req: any): any{
    //Test Responses
    const orgId = req.user.orgId;
    const permissions = req.user.permissions;
    const userId = req.user.userId;
    return {
      'userId': userId, 
      'orgId': orgId,
      'permissions': permissions
    }

  }
    
}
