import { Injectable } from '@nestjs/common';
import { Auth0Service } from 'src/auth0/auth0.service';
import { UserRequest, UserResponse } from './user.dto';
import { UserTransformer } from './user.transformer';

@Injectable()
export class UserService {
  constructor(
    private readonly auth0Service: Auth0Service,
    private readonly transformer: UserTransformer,
  ) {}

  async getUserDetails(userId: string): Promise<UserResponse> {
    return await this.auth0Service.fetchUserDetails(userId);
  }

  async registerUser(user: UserRequest) {
    user = this.transformer.apiToInternal(user);
    return await this.auth0Service.postUser(user);
  }

  async updateUser(user: UserRequest) {
    return await this.auth0Service.patchUser(user);
  }
}
