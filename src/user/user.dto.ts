import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ROLES } from "src/auth0/auth0.roles.enum";

class Identity {
  @ApiProperty()
  @Expose({ name: 'connection' })
  connection: string = 'Username-Password-Authentication';

  @ApiProperty()
  @Expose({ name: 'provider' })
  provider: string = 'auth0';

  @ApiProperty()
  @Expose({ name: 'user_id' })
  userId: string;

  @ApiProperty()
  @Expose({ name: 'isSocial' })
  isSocial: boolean = false;
}

export class UserResponse {
  @ApiProperty()
  @Expose({ name: 'blocked' })
  blocked: boolean;

  @ApiProperty()
  @Expose({ name: 'created_at' })
  createdAt: string;

  @ApiProperty()
  @Expose({ name: 'email' })
  email: string;

  @ApiProperty()
  @Expose({ name: 'email_verified' })
  emailVerified: boolean;

  @ApiProperty()
  @Expose({ name: 'family_name' })
  familyName: string;

  @ApiProperty()
  @Expose({ name: 'given_name' })
  givenName: string;

  @ApiProperty({ type: [Identity] })
  @Expose({ name: 'identities' })
  @Type(() => Identity)
  identities: Identity[];

  @ApiProperty()
  @Expose({ name: 'name' })
  name: string;

  @ApiProperty()
  @Expose({ name: 'nickname' })
  nickname: string;

  @ApiProperty()
  @Expose({ name: 'phone_number' })
  phoneNumber: string;

  @ApiProperty()
  @Expose({ name: 'phone_verified' })
  phoneVerified: boolean;

  @ApiProperty()
  @Expose({ name: 'picture' })
  picture: string;

  @ApiProperty()
  @Expose({ name: 'updated_at' })
  updatedAt: string;

  @ApiProperty()
  @Expose({ name: 'user_id' })
  userId: string;

  @ApiProperty()
  @Expose({ name: 'last_password_reset' })
  lastPasswordReset: string;

  @ApiProperty()
  @Expose({ name: 'last_ip' })
  lastIp: string;

  @ApiProperty()
  @Expose({ name: 'last_login' })
  lastLogin: string;

  @ApiProperty()
  @Expose({ name: 'logins_count' })
  loginsCount: number;
}

export class UserRequest {
  @ApiProperty()
  @Expose({ name: 'email' })
  email: string;

  @ApiProperty()
  @Expose({ name: 'phone_number' })
  phoneNumber: string;

  @ApiProperty()
  @Expose({ name: 'user_metadata' })
  userMetadata?: object;

  @ApiProperty()
  @Expose({ name: 'blocked' })
  blocked?: boolean;

  @ApiProperty()
  @Expose({ name: 'email_verified' })
  emailVerified?: boolean;

  @ApiProperty()
  @Expose({ name: 'phone_verified' })
  phoneVerified?: boolean;

  @ApiProperty()
  @Expose({ name: 'app_metadata' })
  appMetadata?: object;

  @ApiProperty()
  @Expose({ name: 'given_name' })
  givenName: string;

  @ApiProperty()
  @Expose({ name: 'family_name' })
  familyName: string;

  @ApiProperty()
  @Expose({ name: 'name' })
  name?: string;

  @ApiProperty()
  @Expose({ name: 'nickname' })
  nickname?: string;

  @ApiProperty()
  @Expose({ name: 'picture' })
  picture?: string;

  @ApiProperty()
  @Expose({ name: 'user_id' })
  userId: string;

  @ApiProperty()
  @Expose({ name: 'connection' })
  connection?: string = 'Username-Password-Authentication';

  @ApiProperty()
  @Expose({ name: 'password' })
  password: string;

  @ApiProperty()
  @Expose({ name: 'verify_email' })
  verifyEmail?: boolean;

  @ApiProperty()
  @Expose({ name: 'username' })
  username: string;

  @ApiProperty()
  @Expose()
  roles?: string;
}

export class RoleAssignRequest{
  orgId: string;
  userId: string;
  role: string;
}
