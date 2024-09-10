import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth0/auth0.roles.enum';
import { Auth0Service } from 'src/auth0/auth0.service';
import { ApiService } from './api.service';
import { PermissionsGuard } from 'src/auth';
import { AdminProfile } from './dto/response/Profile.Response';
import { SuperAdminProfile } from './dto/response/SuperAdminProfile';
import { instanceToPlain } from 'class-transformer';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@ApiBearerAuth('access-token')
@ApiTags('commons')
@Controller()
export class ApiController {
  constructor(
    private readonly auth0Service: Auth0Service,
    private readonly apiService: ApiService,
  ) {}

  @ApiOperation({ summary: 'get user profile based on role' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    content: {
      'application/json': {
        schema: {
          oneOf: [
            { $ref: getSchemaPath(SuperAdminProfile) },
            { $ref: getSchemaPath(AdminProfile) },
          ],
          discriminator: {
            propertyName: 'role',
            mapping: {
              [ROLES.SuperAdmin]: getSchemaPath(SuperAdminProfile),
              [ROLES.Admin]: getSchemaPath(AdminProfile),
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Roles are not configured',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('profile')
  @ApiCreatedResponse({
    description: 'Profile Responses: ',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(AdminProfile) },
        { $ref: getSchemaPath(SuperAdminProfile) },
      ],
    },
  })
  async getProfile(@Req() req: any): Promise<Record<string, any>> {
    const permissions: string[] = req.user.permissions;
    const role: ROLES = this.auth0Service.rolesDilator(permissions);
    const userId: string = req.user.userId;
    const orgId: string = req.user.orgId;

    if (role == ROLES.SuperAdmin || ROLES.Admin) {
      Logger.log('Fetching profile details for SuperAdmin', userId);
      const profile = await this.apiService.getProfile(
        userId,
        orgId,
        ROLES[role],
      );
      return instanceToPlain(profile);
    } else {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Roles are not configured for you, Please contact ABG Admin.',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: 'Roles Undefined',
        },
      );
    }
  }
}
