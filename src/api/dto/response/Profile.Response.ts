import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { OrganizationResponse } from 'src/organization/organization.dto';
import { UserResponse } from 'src/user/user.dto';

export class Profile {
  @ApiProperty()
  @Expose()
  @Type(() => UserResponse)
  user: UserResponse;

  @ApiProperty()
  @Expose()
  role: string;

  @ApiProperty()
  @Expose()
  @Type(() => OrganizationResponse)
  organization?: OrganizationResponse;
}

export class SuperAdminProfile extends Profile {
  @ApiProperty({ type: [OrganizationResponse] })
  @Expose()
  @Type(() => OrganizationResponse)
  @IsArray()
  organizations: OrganizationResponse[];
}

export class AdminProfile extends Profile {
  @ApiProperty({ type: [UserResponse] })
  @Expose()
  @Type(() => UserResponse)
  @IsArray()
  members: UserResponse[];
}
