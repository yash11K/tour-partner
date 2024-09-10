import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { OrganizationResponse } from 'src/organization/organization.dto';
import { Profile } from './Profile.Response';
import { IsArray } from 'class-validator';

export class SuperAdminProfile extends Profile {
  @ApiProperty({ type: [OrganizationResponse] })
  @Expose()
  @Type(() => OrganizationResponse)
  @IsArray()
  organizations: OrganizationResponse[];
}
