import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ROLES } from './auth0.roles.enum';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { ApiResponseError as ApiResponseError, EndpointOptions } from './auth0.dto';
import { User } from 'src/user/user.dto';
import { OrganizationResponse } from 'src/organization/organization.dto';
import { plainToInstance } from 'class-transformer';

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
        case 'create:members':
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
  public async fetchAllOrganizations(): Promise<OrganizationResponse[]>{
    const endpoint = this.endpointProvider('organizations');
    const organizations = await lastValueFrom( this.httpService.get<OrganizationResponse[]>(endpoint).pipe(
      map(
        res => plainToInstance(OrganizationResponse, res.data),
      )));
      return organizations;
  }

  public async fetchOrganization(_orgId: string): Promise<OrganizationResponse>{
    const endpoint = this.endpointProvider('organizations/:id', { pathParams: {id: _orgId}});
    const organizaton: OrganizationResponse = await lastValueFrom( this.httpService.get<OrganizationResponse>(endpoint).pipe(
      map(res => res.data),
    ));
      return organizaton;
  }

  public async fetchLoggedInUserDetails(_id: string): Promise<User>{
    const endpoint = this.endpointProvider('users/:id', { pathParams: {id: _id }});
    const user = await lastValueFrom(this.httpService.get<User>(endpoint).pipe(
      map(res => res.data),
    ));
    return user;
  }

  public async fetchAllOragnizationMembers(organizationId: string): Promise<User[]> {
    const endpoint = this.endpointProvider('organizations/:id/members', {pathParams: {id: organizationId}});
    const members = await lastValueFrom(this.httpService.get<User[]>(endpoint).pipe(
      map(res => res.data),
    ));
      return members;
  }

  public async postOrganization(orgReq: Record<string, string>): Promise<ApiResponseError> {
    const endpoint = this.endpointProvider('organizations');
    let response: ApiResponseError;

    await lastValueFrom(this.httpService.post<void>(endpoint, orgReq).pipe(
      map(res => {
        if(res.status === 201){
          response.statusCode = res.status;
        } else{
          response = plainToInstance(ApiResponseError, res.data);
        }
      })
    )); 
    return response;
  }

  public async fetchOrganizationByName(name: string): Promise<OrganizationResponse> {
    const endpoint = this.endpointProvider('organizations/name/:org_name', { pathParams: { org_name: name } });
    try{
      const org: OrganizationResponse = await lastValueFrom(this.httpService.get<OrganizationResponse>(endpoint).pipe(
        map(res => res.data),
      ));
      return org;
    }catch(error){
      throw error;
    }
  }
}
