import { Injectable, Logger } from '@nestjs/common';
import { Auth0Service } from 'src/auth0/auth0.service';
import { OrganizationApiRequest, OrganizationRequest, OrganizationResponse } from './organization.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { OrganizationTransformer } from './organization.transformer';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly auth0Service: Auth0Service,
    private readonly transformer: OrganizationTransformer
  ){}

  async postOrganization(org: OrganizationApiRequest): Promise<number> {
    try{
      const orgRequest = this.transformer.apiToInteranl(org);
      Logger.log(JSON.stringify(orgRequest));
      const request = instanceToPlain(orgRequest);
      return await this.auth0Service.postOrganization(request);
    }catch(error){
      Logger.error('Failed to post Organization');
      throw error;
    }
  }

  async getOrganizationByName(name: string): Promise<OrganizationResponse> {
    return this.auth0Service.fetchOrganizationByName(name);
  }
}

