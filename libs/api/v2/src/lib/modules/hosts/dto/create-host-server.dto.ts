import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateHostServerDto {
  @IsString()
  @IsNotEmpty()
  public key: string;

  @IsOptional()
  @IsString()
  public hostname?: string;

  @IsOptional()
  @IsString()
  public agentId?: string;

  @IsOptional()
  @IsString()
  public status?: string;

  @IsOptional()
  @IsObject()
  public system?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  public timestamp?: string;
}
