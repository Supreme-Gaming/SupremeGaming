import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'registration_tokens' })
export class RegistrationToken {
  @Prop({ required: true, unique: true, index: true })
  jti: string;

  @Prop({ required: true })
  agentId: string;

  @Prop({ default: false })
  used: boolean;

  @Prop({ required: true })
  createdBy: string;
}

export type RegistrationTokenDocument = HydratedDocument<RegistrationToken>;
export const RegistrationTokenSchema = SchemaFactory.createForClass(RegistrationToken);
