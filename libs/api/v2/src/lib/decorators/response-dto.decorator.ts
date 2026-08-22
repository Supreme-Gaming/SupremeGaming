import { SetMetadata, Type } from '@nestjs/common';

export const RESPONSE_DTO_KEY = 'responseDto';

export const ResponseDto = <T extends object>(dto: Type<T>) => SetMetadata(RESPONSE_DTO_KEY, dto);
