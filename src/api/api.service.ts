import { Injectable } from '@nestjs/common';
import { Auth0Service } from 'src/auth0/auth0.service';
import { AdminProfile } from './dto/response/Profile.Response';
import { SuperAdminProfile } from "./dto/response/SuperAdminProfile";

@Injectable()
export class ApiService {
  constructor(
    private readonly auth0Service: Auth0Service,
  ) {};

  public async getSuperAdminProfile(id: string, role: string): Promise<SuperAdminProfile> {
    const [organizations, user] = await Promise.all([
      this.auth0Service.fetchAllOrganizations(),
      this.auth0Service.fetchLoggedInUserDetails(id),
    ]);

    return {
      role,
      user,
      organizations
    }
  }
  
  public async getAdminProfile(userId: string, orgId: string, role: string): Promise<AdminProfile> {
    try {
      const [user, members, organization] = await Promise.all([
        this.auth0Service.fetchLoggedInUserDetails(userId),
        this.auth0Service.fetchAllOragnizationMembers(orgId),
        this.auth0Service.fetchOrganization(orgId)
      ]);

      return {
        role,
        user,
        members,
        organization
      };
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      throw new Error('Failed to retrieve admin profile');
    }
  }
}
