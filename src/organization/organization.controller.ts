import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions, PermissionsGuard } from 'src/auth';
import { OrganizationService } from './organization.service';
import { OrganizationApiRequest, OrganizationResponse } from './organization.dto';
import { instanceToPlain } from 'class-transformer';
import { AxiosError } from 'axios';
import { ApiResponseError } from 'src/auth0/auth0.dto';
import { UserResponse } from 'src/user/user.dto';
import { Auth0Service } from 'src/auth0/auth0.service';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@ApiBearerAuth('access-token')
@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly auth0Servcie: Auth0Service,
  ){}

  @Get()
  public async fetchAllorganizations(@Req() req:any){
    const permissions: string[] = req.user.permissions;
    if(this.auth0Servcie.rolesDilator(req.permissions)){

    }
    //const _= this.organizationService.getAllOrganizations();
  }

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
  public async registerNewOrg(@Body() body: OrganizationApiRequest, @Req() req:any): Promise<Record<string, any>> {
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

  @ApiOperation({ summary: 'Fetch organization by organization ID'})
  @ApiResponse({
    status: 200,
    type: OrganizationResponse
  })
  @Permissions('read:organization')
  @Get(':id')
  public async fetchOrganization(@Param('id') id: string): Promise<Record<string,any>>{
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


  @ApiOperation({ summary: 'Fetch an organization by name'})
  @ApiResponse({
    status: 200,
    type: OrganizationResponse
  })
  @Permissions('read:organization')
  @Get('/name/:name')
  public async fetchingOrganization(@Param('name') name: string): Promise<Record<string,any>>{
    const _= await this.organizationService.getOrganizationByName(name);
    return instanceToPlain(_);
  }

  @ApiOperation({ summary: 'Update Organization details or Block/Unblock Organizations' })
  @ApiBody({ 
    type: OrganizationResponse, 
    examples: {
      block: {
        summary: "Block Organization",
        description: "Example of a request body to block an organization",
        value: {
          name: "acme-corp",
          metadata: {
            createdAt: "<date of creation>",  
            isBlocked: "true"
          },
          otherfieldstoChange: "string"
        }
      },
      unblock: {
        summary: "Unblock Organization",
        description: "Example of a request body to unblock an organization, NOTE: false/true is a string",
        value: {
          name: "acme-corp",
          metadata: {
            createdAt: "<date of creation>",  
            isBlocked: "false"
          },
          otherfieldstoChange: "string"
        },
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'The organization has been successfully updated',
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

  @ApiOperation({ summary: 'Fetch members belonging to an organization'})
  @ApiResponse({
    status: 200,
    type: [UserResponse]
  })
  @Permissions('read:organization')
  @Get(':id/members')
  public async fetchOrganizationMembers(@Param('id') orgid: string): Promise<Record<string, string>>{
    const response = await this.organizationService.getOrganizationMembers(orgid);
    return instanceToPlain(response);
  }
}
