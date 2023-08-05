import { IsNotEmpty, IsString } from 'class-validator';

export class PostCapturePaymentDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
