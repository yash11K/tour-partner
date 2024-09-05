import { UserRequest } from "./user.dto";
 
export class UserTransformer{
  public apiToInternal(user: UserRequest){
    user.blocked = false;
    user.name = user.givenName + + ' '+  user.familyName;
    user.emailVerified = false;
    user.phoneVerified = false;
    user.userId = user.email;
    user.connection = 'Username-Password-Authentication'
    user.verifyEmail = true;
    return user;
  }
}
