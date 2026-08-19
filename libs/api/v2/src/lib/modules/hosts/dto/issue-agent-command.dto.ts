import { Allow, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class IssueAgentCommandDto {
  @IsString()
  @IsNotEmpty()
  public type: string;

  @Allow()
  @IsOptional()
  @IsObject()
  public payload?: Record<string, unknown>;
}
