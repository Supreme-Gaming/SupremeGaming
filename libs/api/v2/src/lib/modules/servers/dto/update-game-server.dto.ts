import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateGameServerDto {
  @IsOptional()
  @IsMongoId()
  public host?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  public port?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  public rconport?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public game?: string;

  @IsOptional()
  @IsString()
  public map_name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public rconpass?: string;

  @IsOptional()
  @IsBoolean()
  public shouldProcess?: boolean;

  @IsOptional()
  @IsString()
  public server_directory?: string;

  @IsOptional()
  @IsString()
  public server_alt_dir?: string;
}
