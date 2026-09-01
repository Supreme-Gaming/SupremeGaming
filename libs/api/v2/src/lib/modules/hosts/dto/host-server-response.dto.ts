import { Expose } from 'class-transformer';
import { IsISO8601, IsObject, IsOptional, IsString } from 'class-validator';

import { ToIsoDate, ToStringId } from '../../../dto/transforms';

export class HostServerResponseDto {
  @Expose()
  @ToStringId()
  @IsString()
  public id: string;

  @Expose()
  @IsOptional()
  @IsString()
  public agentId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public status?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public hostname?: string;

  @Expose()
  @IsOptional()
  @IsObject()
  public system?: Record<string, unknown>;

  @Expose()
  @IsOptional()
  @IsString()
  public timestamp?: string;

  @Expose()
  @ToIsoDate()
  @IsOptional()
  @IsISO8601()
  public lastHeartbeat?: string;

  @Expose()
  @ToIsoDate()
  @IsOptional()
  @IsISO8601()
  public createdAt?: string;

  @Expose()
  @ToIsoDate()
  @IsOptional()
  @IsISO8601()
  public updatedAt?: string;
}
