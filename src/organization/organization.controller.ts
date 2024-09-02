import { BadRequestException, Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions, PermissionsGuard } from 'src/auth';
import { OrganizationService } from './organization.service';
import { OrganizationApiRequest, OrganizationRequest, OrganizationResponse } from './organization.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@ApiBearerAuth('access-token')
@ApiTags('commons')
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
  ){}

  @Permissions('create:organization')
  @Post()
  public async registerNewOrg(@Body() body: OrganizationApiRequest): Promise<any>{
    try{
      const postOrgStatus = await this.organizationService.postOrganization(body);
      if(postOrgStatus == 201){
        const org: OrganizationResponse =  await this.organizationService.getOrganizationByName(body.name);
        return instanceToPlain(org);
      } else{
        Logger.log('error in post org');
      }
    }catch(error){
    }
  }
}
