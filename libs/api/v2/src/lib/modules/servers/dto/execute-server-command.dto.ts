import { Type } from 'class-transformer';
import { IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class ExecuteServerCommandDto {
  @IsString()
  @IsNotEmpty()
  public command: string;

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
  public game?: string;
}
