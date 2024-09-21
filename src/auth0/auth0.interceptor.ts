import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Auth0Service } from './auth0.service';
import { ROLES } from './auth0.roles.enum';

@Injectable()
export class Auth0Interceptor implements NestInterceptor {
  constructor(
    private readonly auth0Service: Auth0Service,
  ){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const permissions = request.user?.permissions || [];
    
    const role: ROLES = this.auth0Service.rolesDilator(permissions);
    request.headers['x-user-role'] = ROLES[role];
    return next.handle();
  }
}
