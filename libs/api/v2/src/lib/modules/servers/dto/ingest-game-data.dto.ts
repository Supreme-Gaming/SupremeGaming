import { Type } from 'class-transformer';
import { Allow, IsArray, IsISO8601, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class IngestGameDataPlayerDto {
  @Allow()
  public PlayerName?: string;

  @Allow()
  public Level?: number;

  @Allow()
  public TotalEngramPoints?: number;

  @Allow()
  public CharacterName?: string;

  @Allow()
  public TribeId?: number | false;

  @Allow()
  public EosId?: string;

  @Allow()
  public PlayerId: number;

  @Allow()
  public FileCreated?: string;

  @Allow()
  public FileUpdated?: string;
}

export class IngestGameDataTribeDto {
  @Allow()
  public Name?: string;

  @Allow()
  public OwnerId?: number;

  @Allow()
  public Id: number;

  @Allow()
  public TribeLogs?: string[];

  @Allow()
  public TribeMemberNames?: string[];

  @Allow()
  public FileCreated?: string;

  @Allow()
  public FileUpdated?: string;
}

export class IngestGameDataDto {
  @IsString()
  @IsNotEmpty()
  public game: string;

  @IsISO8601()
  public collectedAt: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngestGameDataPlayerDto)
  public players: IngestGameDataPlayerDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngestGameDataTribeDto)
  public tribes: IngestGameDataTribeDto[];
}
