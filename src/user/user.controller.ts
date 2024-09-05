import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Permissions, PermissionsGuard } from 'src/auth';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UserRequest } from './user.dto';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@ApiBearerAuth('access-token')
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ){}; 

  @ApiOperation({ summary: 'Fetch a user'})
  @Permissions('read:user')
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<Record<string,any>>{
    const _= await this.userService.getUserDetails(id);
    return instanceToPlain(_); 
  }

  @ApiOperation({ summary: 'Register a new user'})
  @Post()
  async postUser(@Body() user: UserRequest): Promise<Record<string,any>>{
    return this.userService.registerUser(plainToInstance(UserRequest, user));
  }
}
