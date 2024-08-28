import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ROLES } from './auth0.roles.enum';
import { lastValueFrom, map } from 'rxjs';
import { EndpointOptions, Organization } from './auth0.dto';

@Injectable()
export class Auth0Service{
  private readonly domain: string = process.env.AUTH0_DOMAIN;
  constructor(
    private readonly httpService: HttpService,
  ){};

  public rolesDilator(permissions : string[]): ROLES{
    let role : ROLES = ROLES.NotAssigned;

    for(const permission of permissions){
      switch(permission){
        case 'create:organization':
          return ROLES.SuperAdmin;
        case 'create:member':
          role = ROLES.Admin;
        break;
        case 'read:member':
          if(role < ROLES.Admin){
            role = ROLES.Agent
          }
        break;
        default: continue;
      }
      return role;
    }
  }

private endpointProvider(ep: string, options?: EndpointOptions): string {
  let endpoint: string = `https://${this.domain}/api/v2/${ep}`;

  if (options?.pathParams) {
    Object.entries(options.pathParams).forEach(([key, value]) => {
      endpoint = endpoint.replace(`:${key}`, encodeURIComponent(value));
    });
  }

  if (options?.queryParams) {
    const queryString = Object.entries(options.queryParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    if (queryString) {
      endpoint += `?${queryString}`;
    }
  }

  return endpoint;
}
  public async fetchAllOrganizations(): Promise<Organization[]>{
    const endpoint = this.endpointProvider('organizations');
    const organizations = await lastValueFrom( this.httpService.get<Organization[]>(endpoint).pipe(
      map(res => res.data),
    ));
      return organizations;
  }

  public async fetchLoggedInUserDetails(_id: string): Promise<User>{
    const endpoint = this.endpointProvider('users/:id', { pathParams: {id: _id }});
    const user = await lastValueFrom(this.httpService.get<User>(endpoint).pipe(
      map(res => res.data),
    ));
    return user;
  }
}
