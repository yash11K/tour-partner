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

  @ApiProperty()
  branding: Branding;
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
}

export class OrganizationApiRequest{
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  displayName: string;

  @Expose()
  @ApiProperty()
  logo: string;
}
