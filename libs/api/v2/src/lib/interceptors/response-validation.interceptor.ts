import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, switchMap } from 'rxjs';

import { RESPONSE_DTO_KEY } from '../decorators/response-dto.decorator';
import { toDto } from '../dto/to-dto';

export interface ResponseValidationInterceptorOptions {
  hideErrorDetails?: boolean;
}

@Injectable()
export class ResponseValidationInterceptor implements NestInterceptor {
  public constructor(
    private readonly reflector: Reflector,
    private readonly options: ResponseValidationInterceptorOptions = {}
  ) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const dto = this.reflector.getAllAndOverride<Type<object>>(RESPONSE_DTO_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!dto) {
      return next.handle();
    }

    return next.handle().pipe(switchMap((data) => toDto(dto, data, { hideErrorDetails: this.options.hideErrorDetails })));
  }
}
