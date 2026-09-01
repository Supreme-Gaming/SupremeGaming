import { IsMongoId } from 'class-validator';

export class ObjectIdParamsDto {
  @IsMongoId()
  public id!: string;
}
