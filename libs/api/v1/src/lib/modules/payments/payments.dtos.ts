import { IsNotEmpty, IsString } from 'class-validator';

export class GetPayPalOrderDetailsDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
