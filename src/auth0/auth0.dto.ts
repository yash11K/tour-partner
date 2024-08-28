import { Expose, Transform } from "class-transformer";

export interface Auth0Config{
  clientId: string;
  clientSecret: string;
  grantType: string;
  domain: string;
}

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

class Branding{
  logo_url: string;
}

export class Organization{
  id: string;
  name: string;
  display_name: string;
  branding: Branding;
}

