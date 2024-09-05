import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Permissions, PermissionsGuard } from 'src/auth';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { RoleAssignRequest, UserRequest, UserResponse } from './user.dto';
import { Auth0Service } from 'src/auth0/auth0.service';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@ApiBearerAuth('access-token')
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly auth0Service: Auth0Service
  ){}; 

  @ApiOperation({ summary: 'Fetch a user'})
  @Permissions('read:user')
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<Record<string,any>>{
    const _= await this.userService.getUserDetails(id);
    return instanceToPlain(_); 
  }

  @ApiOperation({ summary: 'Register a new super-admin'})
  @Permissions('create:organization')
  @Post('bu')
  async postUser(@Body() user: UserRequest): Promise<Record<string,any>>{
    let userResponse = await this.userService.registerUser(plainToInstance(UserRequest, user));
    userResponse = plainToInstance(UserResponse,userResponse);
    let rolesRequest: RoleAssignRequest = {
      orgId : 'org_6ly0QWO8YsINWH7b',
      userId: decodeURIComponent(userResponse.userId),
      role: 'rol_k6rL1bL7wv3EqVGT',

    }
    await this.auth0Service.assignRolesToUser(rolesRequest);
    return user;
  }
}
