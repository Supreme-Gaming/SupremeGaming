import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { GameServerConfigDto } from './game-server-config.dto';

export class CreateGameServerDto extends GameServerConfigDto {
  @IsString()
  @IsNotEmpty()
  public rconpass: string;

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
