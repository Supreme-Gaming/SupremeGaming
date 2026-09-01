import { Expose, Type } from 'class-transformer';
import { IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

import { ToStringId } from '../../../dto/transforms';

export class GameServerConfigDto {
  @Expose()
  @ToStringId()
  @IsMongoId()
  public host: string;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  public port: number;

  @Expose()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  public rconport: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  public game: string;

  @Expose()
  @IsOptional()
  @IsString()
  public map_name?: string;
}
