import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class GetServerByPortParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  public port: number;
}
