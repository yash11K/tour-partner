import { ApiProperty } from "@nestjs/swagger";

export class User {
  @ApiProperty()
  activityStatus?: boolean;
  @ApiProperty()
  createdAt?: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  verifiedEmail?: boolean;
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  lastName?: string;
  @ApiProperty()
  phoneNumber?: string;
  @ApiProperty()
  picture: string;
  @ApiProperty()
  lastLogin?: string;
  @ApiProperty()
  userId: string;
}
