// unique-constraint.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (
          error instanceof QueryFailedError &&
          error.message.includes(
            'duplicate key value violates unique constraint',
          )
        ) {
          // Error de violación de restricción única
          return throwError(new BadGatewayException('Email already exist'));
        }
        // Pasa el error si no es un error de violación de restricción única
        return throwError(error);
      }),
    );
  }
}
