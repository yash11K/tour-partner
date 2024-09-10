import { Injectable } from '@nestjs/common';
import { Auth0Service } from 'src/auth0/auth0.service';
import { Profile } from './dto/response/Profile.Response';

@Injectable()
export class ApiService {
  constructor(private readonly auth0Service: Auth0Service) {}
  public async getProfile(
    userId: string,
    orgId: string,
    role: string,
  ): Promise<Profile> {
    const [user, organization] = await Promise.all([
      this.auth0Service.fetchUserDetails(userId),
      this.auth0Service.fetchOrganization(orgId),
    ]);

    return {
      user,
      organization,
      role,
    };
  }
}
