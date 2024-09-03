import { BadRequestException, Body, Controller, HttpCode, HttpException, HttpStatus, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions, PermissionsGuard } from 'src/auth';
import { OrganizationService } from './organization.service';
import { OrganizationApiRequest, OrganizationResponse } from './organization.dto';
import { instanceToPlain } from 'class-transformer';
import { AxiosError } from 'axios';
import { ApiResponseError } from 'src/auth0/auth0.dto';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@ApiBearerAuth('access-token')
@ApiTags('commons')
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
  ){}

  @ApiOperation({ summary: 'Register a new organization' })
  @ApiBody({ type: OrganizationApiRequest })
  @ApiResponse({
    status: 201,
    description: 'The organization has been successfully created.',
    type: OrganizationResponse
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request or any other error',
    type: ApiResponseError
  })
  @Permissions('create:organization')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async registerNewOrg(@Body() body: OrganizationApiRequest): Promise<Record<string, any>> {
    try {
      const response: ApiResponseError = await this.organizationService.postOrganization(body);
      if (response.statusCode === 201) {
        const org: OrganizationResponse = await this.organizationService.getOrganizationByName(body.name);
        return instanceToPlain(org);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        Logger.error('Error in registerNewOrg:', error);
        throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
