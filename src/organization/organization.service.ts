import { Injectable, Logger } from '@nestjs/common';
import { Auth0Service } from 'src/auth0/auth0.service';
import { OrganizationApiRequest, OrganizationRequest, OrganizationResponse } from './organization.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { OrganizationTransformer } from './organization.transformer';
import { ApiResponseError as ApiResponseError } from 'src/auth0/auth0.dto';

@Injectable()
  export class OrganizationService {
    constructor(
      private readonly auth0Service: Auth0Service,
      private readonly transformer: OrganizationTransformer
    ){}

  async postOrganization(org: OrganizationApiRequest): Promise<ApiResponseError> {
    let _: ApiResponseError;
    const orgRequest = this.transformer.apiToInteranl(org);
    const request = instanceToPlain(orgRequest);
    _= await this.auth0Service.postOrganization(request);
    return _;
  }
  async getOrganizationByName(name: string): Promise<OrganizationResponse> {
    return this.auth0Service.fetchOrganizationByName(name);
  }
}

