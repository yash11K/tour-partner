import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Permissions, PermissionsGuard } from "src/auth";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { RoleAssignRequest, UserRequest, UserResponse } from "./user.dto";

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@ApiBearerAuth('access-token')
@ApiTags('users')
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly auth0Service: Auth0Servic,
  ) {}

  @ApiOperation({ summary: 'Fe"Fetch a user"
  @Permissions('read:user')
  @Get(':id')
  async getUser(@Param("id") id: string): Promise<Record<string, any>> {
    const _ = await this.userService.getUserDetails(id);
    return instanceToPlain(_);
  }

  @ApiOperation({ summary: "Register a new super-admin" })
  @Permissions('create:organization')
  @Post('abg/admins')
  async postUser(@Body() user: UserRequest): Promise<Record<string, any>> {
    let userResponse = await this.userService.registerUser(
      plainToInstance(UserRequest, user)
    );
    userResponse = plainToInstance(UserResponse, userResponse);
    const rolesRequest: RoleAssignRequest = {
      orgId: "org_6ly0QWO8YsINWH7b",
      userId: userResponse.userId,
      role: 'rol_i3Buefby1WswZafK',
    };
    await this.auth0Service.assignOrganization(
      "org_6ly0QWO8YsINWH7b",
      userResponse.userId
    );
    await this.auth0Service.assignRolesToUser(rolesRequest);
    return user;
  }

  @ApiOperation({
    summary: "Registers a new tour-admin with a particular organization"
  })
  @Permissions('create:organization')
  @Post('tours/:id/admins')
  async postTourAdmin(@Body() user: UserRequest, @Param("id") id: string) {
    let userResponse = await this.userService.registerUser(
      plainToInstance(UserRequest, user)
    );
    userResponse = plainToInstance(UserResponse, userResponse);
    const rolesRequest: RoleAssignRequest = {
      orgId: id,
      userId: userResponse.userId,
      role: 'rol_k6rL1bL7wv3EqVGT',
    };
    await this.auth0Service.assignOrganization(id, userResponse.userId);
    await this.auth0Service.assignRolesToUser(rolesRequest);
  }

  @ApiOperation({
    summary:
      "Registers a new member with the organization tourAdmin is logged in"
  })
  @Permissions('create:members')
  @Post('tours/members')
  async postTourMembers(@Body() user: UserRequest, @Req() req: any) {
    let userResponse = await this.userService.registerUser(
      plainToInstance(UserRequest, user)
    );
    userResponse = plainToInstance(UserResponse, userResponse);
    const rolesRequest: RoleAssignRequest = {
      orgId: req.user.orgId,
      userId: userResponse.userId,
      role: 'rol_A0QFQM4Lr5mYQtZD',
    };
    await this.auth0Service.assignOrganization(
      rolesRequest.orgId,
      userResponse.userId
    );
    await this.auth0Service.assignRolesToUser(rolesRequest);
    return userResponse;
  }

  @ApiOperation({
    summary:
      "Updates a tour member with the organization tourAdmin is logged in from"
  })
  @Permissions('edit:members')
  @Post('tours/members')
  async updatesTourMembers(@Body() user: UserRequest) {
    return await this.userService.updateUser(
      plainToInstance(UserRequest, user)
    );
  }

  @ApiOperation({ summary: 'Updates a tour admin' })
  @Permissions('create:organization')
  @Post('tours/admins')
  async updatesTourAgent(@Body() user: UserRequest) {
    return await this.userService.updateUser(
      plainToInstance(UserRequest, user)
    );
  }
}
