import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsArray } from "class-validator";
import { OrganizationResponse } from "src/organization/organization.dto";
import { User } from "src/user/user.dto";

export class Profile {
  @ApiProperty()
  @Expose()
  @Type(() => User)
  user: User;

  @ApiProperty()
  @Expose()
  role: String;

  @ApiProperty()
  @Expose()
  @Type(() => OrganizationResponse)
  organization?: OrganizationResponse;
}

export class SuperAdminProfile extends Profile {
  @ApiProperty({type: [OrganizationResponse]})
  @Expose()
  @Type(() => OrganizationResponse)
  @IsArray()
  organizations: OrganizationResponse[]
}

export class AdminProfile extends Profile {
  @ApiProperty({type: [User]})
  @Expose()
  @Type(() => User)
  @IsArray()
  members: User[];
}
