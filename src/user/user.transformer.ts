import { User, UserRequest, UserResponse } from './user.dto';

export class UserTransformer {
  public apiToInternal(user: UserRequest): UserRequest {
    user.blocked = false;
    user.name = user.givenName + +' ' + user.familyName;
    user.emailVerified = false;
    user.phoneVerified = false;
    user.connection = 'Username-Password-Authentication';
    user.verifyEmail = true;
    return user;
  }

  public internalToApi(user: UserResponse): User {
    const userApi: User = new User();
    userApi.userId = user.userId;
    userApi.email = user.email;
    userApi.picture = user.picture;
    userApi.name = user.name;
    userApi.role = user.role?.at(0).name;
    return userApi;
  }
}
