import { Injectable } from '@nestjs/common';
import { Auth0Service } from 'src/auth0/auth0.service';
import {
  OrganizationApiRequest,
  OrganizationResponse,
} from './organization.dto';
import { instanceToPlain } from 'class-transformer';
import { OrganizationTransformer } from './organization.transformer';
import { User } from 'src/user/user.dto';
import { UserTransformer } from '../user/user.transformer';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly auth0Service: Auth0Service,
    private readonly transformer: OrganizationTransformer,
    private readonly userTransformer: UserTransformer,
  ) {}

  async postOrganization(org: OrganizationApiRequest): Promise<number> {
    const orgRequest = this.transformer.apiToInternal(org, 'post');
    const request = instanceToPlain(orgRequest);
    return await this.auth0Service.sendOrganizationRequest('post', request);
  }
  async getOrganizationByName(name: string): Promise<OrganizationResponse> {
    return await this.auth0Service.fetchOrganizationByName(name);
  }

  async getOrganization(id: string): Promise<OrganizationResponse> {
    return await this.auth0Service.fetchOrganization(id);
  }

  async patchOrganization(org: OrganizationApiRequest, id: string) {
    const orgRequest = this.transformer.apiToInternal(org, 'patch');
    const request = instanceToPlain(orgRequest);
    if (org.metadata.isBlocked == 'true') {
      await this.auth0Service.deleteOrganizationConnection(id);
    } else if (org.metadata.isBlocked == 'false') {
      await this.auth0Service.assignOrganizationConnection(id);
    }
    return await this.auth0Service.sendOrganizationRequest(
      'patch',
      request,
      id,
    );
  }

  async getOrganizationMembers(orgid: string): Promise<User[]> {
    return (await this.auth0Service.fetchAllOragnizationMembers(orgid)).map(
      this.userTransformer.internalToApi,
    );
  }

  async getAllOrganizations() {
    const _ = await this.auth0Service.fetchAllOrganizations();
    return instanceToPlain(_);
  }
}
