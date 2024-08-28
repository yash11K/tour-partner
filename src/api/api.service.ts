import { Injectable } from '@nestjs/common';
import { Organization } from 'src/auth0/auth0.dto';
import { Auth0Service } from 'src/auth0/auth0.service';

@Injectable()
export class ApiService {
  constructor(
    private readonly auth0Service: Auth0Service,
  ) {};
  public async getSuperAdminProfile(id: string): Promise<{organizations: Organization[], user: User}> {
    const _orgs = await this.auth0Service.fetchAllOrganizations();
    const _user = await this.auth0Service.fetchLoggedInUserDetails(id);
    return {
      organizations: _orgs,
      user: _user
    }; 
  }
}
