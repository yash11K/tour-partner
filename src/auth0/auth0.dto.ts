import { Expose, Transform } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';

export interface Auth0Config{
  clientId: string;
  clientSecret: string;
  grantType: string;
  domain: string;
}


//export class ConnectionConfig {
//  @Expose()
//  @ApiProperty({ description: 'Unique identifier for the connection' })
//  connectionId: string;
//
//  @Expose()
//  @ApiProperty({ description: 'Whether to assign membership on login' })
//  assignMembershipOnLogin: boolean;
//
//  @Expose()
//  @ApiProperty({ description: 'Whether to show as a button' })
//  showAsButton: boolean;
//
//  @Expose()
//  @ApiProperty({ description: 'Whether sign-up is enabled for this connection' })
//  isSignUpEnabled: boolean;
//}

export interface EndpointOptions {
  pathParams?: Record<string, string>;
  queryParams?: Record<string, string>;
}

export class TokenRequest{
  @Expose({ name: 'grant_type' })
  grantType: string;

  @Expose({ name: 'client_id' })
  clientId: string;

  @Expose({ name: 'client_secret' })
  clientSecret: string;

  @Expose()
  audience: string;
}

/**
  *
  * Deals with API Responses having emptybody
  *
  * @returns statusCode only when 2XX otherwise error, errorCode, message 
  * @beta
  * 
*/
export class ApiResponseError{
  @Expose()
  statusCode: number;

  @Expose()
  error?: string;

  @Expose()
  errorCode?: string;

  @Expose()
  message?:string;
}
