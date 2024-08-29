import { Injectable } from '@nestjs/common';
import { Organization } from 'src/auth0/auth0.dto';
import { ROLES } from 'src/auth0/auth0.roles.enum';
import { Auth0Service } from 'src/auth0/auth0.service';

@Injectable()
export class ApiService {
  constructor(
    private readonly auth0Service: Auth0Service,
  ) {};

  public async getSuperAdminProfile(_id: string, _role: string): Promise<{organizations: Organization[], user: User, role: string}> {
    const _orgs = await this.auth0Service.fetchAllOrganizations();
    const _user = await this.auth0Service.fetchLoggedInUserDetails(_id);
    return {
      role: _role,
      organizations: _orgs,
      user: _user,
    }; 
  }

  public async getAdminProfile(_userId: string, _orgId: string, _role: string): Promise<any> {
    const _members = await this.auth0Service.fetchAllOragnizationMembers(_orgId);
    const _organization = await this.auth0Service.fetchOrganization(_orgId);
    return{role:_role, organiation: _organization ,members: _members};
  }
}
