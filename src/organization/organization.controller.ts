import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions, PermissionsGuard } from 'src/auth';
import { OrganizationService } from './organization.service';
import { OrganizationApiRequest, OrganizationResponse } from './organization.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
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
      const response = await this.organizationService.postOrganization(body);
      if (response === 201) {
        const org: OrganizationResponse = await this.organizationService.getOrganizationByName(body.name);
        return instanceToPlain(org);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        Logger.error('Error in registerNewOrg:', error);
        return new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Permissions('read:organization')
  @Get(':id')
  public async fetchOrganization(@Param('id') id: string){
    try{
      const _= await this.organizationService.getOrganization(id);
      return instanceToPlain(_);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        Logger.error('Error in fetchingOrganization', error);
        throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Permissions('read:organization')
  @Get('/name/:name')
  public async fetchingOrganization(@Param('name') name: string): Promise<Record<string,any>>{
    const _= await this.organizationService.getOrganizationByName(name);
    return instanceToPlain(_);
  }

  @ApiBody({ type: OrganizationResponse })
  @ApiResponse({
    status: 200,
    description: 'The organization has been successfully created',
    type: OrganizationResponse
  })

  @Permissions('edit:organization')
  @Patch(':id')
  public async updateOrg(@Body() body: OrganizationApiRequest, @Param('id') orgId: string): Promise<Record<string,any>> {
    const response = await this.organizationService.patchOrganization(body, orgId);
    if(response === 200) {
      const org: OrganizationResponse = await this.organizationService.getOrganizationByName(body.name);
      return instanceToPlain(org);
    }
    else throw new Error("Could not patch organization ${body.name}");
  }

  @Permissions('read:organization')
  @Get(':id/members')
  public async fetchOrganizationMembers(@Param('id') orgid: string): Promise<Record<string, string>>{
    const response = await this.organizationService.getOrganizationMembers(orgid);
    return instanceToPlain(response);
  }
}
