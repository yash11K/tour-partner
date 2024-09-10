import { Injectable } from '@nestjs/common';
import { Auth0Service } from 'src/auth0/auth0.service';
import {
  OrganizationApiRequest,
  OrganizationResponse,
} from './organization.dto';
import { instanceToPlain } from 'class-transformer';
import { OrganizationTransformer } from './organization.transformer';
import { User } from 'src/user/user.dto';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly auth0Service: Auth0Service,
    private readonly transformer: OrganizationTransformer,
    private readonly userTransformer: UserTransforme,
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
    const _ = await this.auth0Service.sendOrganizationRequest(
      'patch',
      request,
      id,
    );
    return _;
  }

  async getOrganizationMembers(orgid: string): Promise<User[]> {
    const members = (
      await this.auth0Service.fetchAllOragnizationMembers(orgid)
    ).map(this.userTransformer.internalToApi);
    return members;
  }

  async getAllOrganizations() {
    const _ = await this.auth0Service.fetchAllOrganizations();
    return instanceToPlain(_);
  }
}
