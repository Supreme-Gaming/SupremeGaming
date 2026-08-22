import { CallHandler, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { lastValueFrom, of } from 'rxjs';

import { ResponseDto } from '../decorators/response-dto.decorator';
import { ResponseValidationInterceptor } from './response-validation.interceptor';

class UserResponseDto {
  @Expose()
  @IsString()
  public id: string;

  @Expose()
  @IsString()
  public name: string;
}

class DecoratedController {
  @ResponseDto(UserResponseDto)
  public getUser() {
    return { id: '1', name: 'Ada', password: 'secret' };
  }

  public getRaw() {
    return { password: 'secret' };
  }
}

describe('ResponseValidationInterceptor', () => {
  const interceptor = new ResponseValidationInterceptor(new Reflector());
  const controller = new DecoratedController();

  const createContext = (handler: (...args: unknown[]) => unknown): ExecutionContext =>
    ({
      getHandler: () => handler,
      getClass: () => DecoratedController,
    } as unknown as ExecutionContext);

  it('passes through when no response DTO is declared', async () => {
    const payload = { password: 'secret' };
    const next: CallHandler = { handle: () => of(payload) };

    await expect(lastValueFrom(interceptor.intercept(createContext(controller.getRaw), next))).resolves.toEqual(payload);
  });

  it('transforms and strips fields that are not on the response DTO', async () => {
    const next: CallHandler = { handle: () => of({ id: '1', name: 'Ada', password: 'secret' }) };

    await expect(lastValueFrom(interceptor.intercept(createContext(controller.getUser), next))).resolves.toEqual({
      id: '1',
      name: 'Ada',
    });
  });

  it('throws when the outgoing payload does not match the response DTO', async () => {
    const next: CallHandler = { handle: () => of({ id: 1, name: 'Ada' }) };

    await expect(lastValueFrom(interceptor.intercept(createContext(controller.getUser), next))).rejects.toBeInstanceOf(
      InternalServerErrorException
    );
  });
});
