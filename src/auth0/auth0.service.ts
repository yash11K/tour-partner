import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ROLES } from './auth0.roles.enum';
import { last, lastValueFrom, map } from 'rxjs';
import { ApiResponseError as ApiResponseError, EndpointOptions } from './auth0.dto';
import { OrganizationResponse } from 'src/organization/organization.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { RoleAssignRequest, UserRequest, UserResponse } from 'src/user/user.dto';

@Injectable()
export class Auth0Service{
  private readonly domain: string = process.env.AUTH0_DOMAIN;
  private readonly connectionId: string = 'con_41JuBNf01LoFW24o';
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
    const _= await lastValueFrom( this.httpService.get<OrganizationResponse>(endpoint).pipe(
      map(res => res.data),
    ));
    return plainToInstance(OrganizationResponse, _);
  }

  public async fetchUserDetails(_id: string): Promise<UserResponse>{
    const endpoint = this.endpointProvider('users/:id', { pathParams: {id: _id }});
    const user = await lastValueFrom(this.httpService.get<UserResponse>(endpoint).pipe(
      map(res => res.data),
    ));
    return user;
  }

  public async fetchAllOragnizationMembers(organizationId: string): Promise<UserResponse[]> {
    const endpoint = this.endpointProvider('organizations/:id/members', {pathParams: {id: organizationId}});
    const members = await lastValueFrom(this.httpService.get<UserResponse[]>(endpoint).pipe(
      map(res => res.data),
    ));
      return members;
  }


  public async sendOrganizationRequest(
    method: 'post' | 'patch', 
    orgReq: Record<string, string>,
    organizationId?: string): Promise<number> {
      let endpoint: string;
      if(method === 'patch'){
        endpoint = this.endpointProvider('organizations/:id', {pathParams: {id: organizationId }});
      } else endpoint = this.endpointProvider('organizations');

      let response = await lastValueFrom(this.httpService[method]<void>(endpoint, orgReq).pipe(
        map(res => res.status)
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

  public async assignOrganizationConnection(id: string) {
    const endpoint = this.endpointProvider('organizations/:orgId/enabled_connections', {pathParams: {orgId: id}})
    const body = {
      connection_id: this.connectionId,
      assign_membership_on_login: true,
      is_signup_enabled: true,
      show_as_button: true,
    }
    const response = await lastValueFrom(this.httpService.post<any>(endpoint, body).pipe(
      map(res => res.data)
    ));
    return response;
  }

  public async deleteOrganizationConnection(id: string) {
    const endpoint = this.endpointProvider('organizations/:orgId/enabled_connections/:connId', { pathParams: { orgId: id, connId: this.connectionId}})
    const status = await lastValueFrom(this.httpService.delete<void>(endpoint).pipe(
      map(res => res.data))
    );
  }

  //USERS
  
  public async postUser(user: UserRequest){
    const endpoint = this.endpointProvider('users');
    let body = instanceToPlain(user);
    let response = await lastValueFrom(this.httpService.post<UserResponse>(endpoint, body).pipe(
      map(res => res.data),
    ));
    return response;
  }

  public async assignRolesToUser(roleRequest: RoleAssignRequest){
    const endpoint = this.endpointProvider('organizations/:orgId/members/:userId/roles', { pathParams: { orgId: roleRequest.orgId, userId: decodeURIComponent(roleRequest.userId)}});
    const body = {roles: [roleRequest.role]};
    const statusCode = await lastValueFrom(this.httpService.post<void>(endpoint, body).pipe(
      map(res => res.status)
    ));
    return statusCode;
  }

  public async assignOrganization(orgId: string, userId: string) {
    const endpoint = this.endpointProvider('organizations/:id/members', {pathParams: {id: orgId}});
    const body = {
      members: [userId]
    }
    const statusCode = await lastValueFrom(this.httpService.post<void>(endpoint, body).pipe(
      map(res => res.status)
    ));
    return statusCode;
  }
  public async patchUser(user: UserRequest) {
    const endpoint = this.endpointProvider('user');
    let body = instanceToPlain(user);
    let response = await lastValueFrom(this.httpService.patch(endpoint, body).pipe(
      map(res => res.data)
    ));
    return response;
  }
}
