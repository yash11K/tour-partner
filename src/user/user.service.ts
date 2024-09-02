import { Injectable } from '@nestjs/common';
import { User } from './user.dto';

@Injectable()
export class UserService {
  getUserDetails(userId: string): User{
    return null;
  }
}
