import { InternalServerErrorException, Type } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export interface ToDtoOptions {
  validate?: boolean;
  hideErrorDetails?: boolean;
}

function toPlain(data: unknown): object {
  if (data != null && typeof data === 'object' && typeof (data as { toJSON?: unknown }).toJSON === 'function') {
    return (data as { toJSON: () => object }).toJSON();
  }

  return instanceToPlain(data);
}

function flattenValidationErrors(errors: ValidationError[]): Array<Record<string, unknown>> {
  return errors.map((error) => ({
    property: error.property,
    constraints: error.constraints ? Object.values(error.constraints) : undefined,
    children: error.children?.length ? flattenValidationErrors(error.children) : undefined,
  }));
}

export async function toDto<T extends object>(cls: Type<T>, data: Array<unknown>, options?: ToDtoOptions): Promise<T[]>;
export async function toDto<T extends object>(cls: Type<T>, data: unknown, options?: ToDtoOptions): Promise<T>;
export async function toDto<T extends object>(
  cls: Type<T>,
  data: unknown,
  options: ToDtoOptions = {}
): Promise<T | T[]> {
  if (data == null) {
    return data as T;
  }

  const isArray = Array.isArray(data);
  const transformed = (isArray ? data : [data]).map((item) =>
    plainToInstance(cls, toPlain(item), {
      excludeExtraneousValues: true,
    })
  );

  if (options.validate !== false) {
    for (const item of transformed) {
      const errors = await validate(item, {
        whitelist: true,
        validationError: { target: false, value: false },
      });

      if (errors.length > 0) {
        throw new InternalServerErrorException({
          message: 'Response validation failed',
          ...(options.hideErrorDetails ? {} : { errors: flattenValidationErrors(errors) }),
        });
      }
    }
  }

  return isArray ? transformed : transformed[0];
}
