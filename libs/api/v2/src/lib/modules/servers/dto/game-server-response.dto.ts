import { Expose } from 'class-transformer';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

import { ToIsoDate, ToStringId } from '../../../dto/transforms';
import { GameServerConfigDto } from './game-server-config.dto';

export class GameServerResponseDto extends GameServerConfigDto {
  @Expose()
  @ToStringId()
  @IsString()
  public id: string;

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
