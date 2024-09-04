import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class Branding {
  @Expose({ name: 'logo_url' })
  @ApiProperty({ description: 'URL of the organization logo' })
  logoUrl: string;
}

export class OrganizationResponse{
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose({ name: 'display_name' })
  @ApiProperty()
  displayName: string;

  @Expose()
  @ApiProperty()
  branding: Branding;

  @Expose()
  @ApiProperty()
  metadata: Record<string,string>
}

export class OrganizationRequest {
  @Expose()
  name: string;

  @Expose({ name: 'display_name' })
  displayName: string;

  @Expose()
  @Type(() => Branding)
  branding: Branding;

  @Expose({ name: 'enabled_connections' })
  enabledConnections: any;

  @Expose()
  metadata?: Record<string,string>;
 
}

export class OrganizationApiRequest{
  @Expose()
  @ApiProperty()
  name: string;

  @Expose({ name: 'display_name'})
  @ApiProperty()
  displayName: string;

  @Expose()
  @ApiProperty()
  logo: string;

  @Expose()
  @ApiProperty()
  metadata?: Record<string,string>
}
