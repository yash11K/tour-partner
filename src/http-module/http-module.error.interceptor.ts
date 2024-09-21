import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: AxiosError) => {
        if (error.response) {
          // If it's an HTTP error response (4xx, 5xx)
          const message =  error.response.data;
          return throwError(() => new HttpException(message, error.response.status));
        } else if (error.request) {
          Logger.error('No response received:', error.request);
          return throwError(() => new HttpException('No response from server', HttpStatus.BAD_GATEWAY));
        } else {
          Logger.error('Error setting up the request:', error.message);
          return throwError(() => new HttpException('Request setup error', HttpStatus.INTERNAL_SERVER_ERROR));
        }
      })
    );
  }
}
