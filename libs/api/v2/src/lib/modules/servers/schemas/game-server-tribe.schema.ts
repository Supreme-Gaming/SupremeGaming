import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { GameServer } from './game-server.schema';

@Schema({ timestamps: true, collection: 'tribes' })
export class GameServerTribe {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: GameServer.name, required: true })
  server: mongoose.Types.ObjectId;

  @Prop({ required: true })
  game: string;

  @Prop({ required: true })
  collectedAt: Date;

  @Prop()
  Name: string;

  @Prop()
  OwnerId: number;

  @Prop({ required: true })
  Id: number;

  @Prop({ type: [String], default: [] })
  TribeLogs: string[];

  @Prop({ type: [String], default: [] })
  TribeMemberNames: string[];

  @Prop()
  FileCreated: string;

  @Prop()
  FileUpdated: string;
}

export type GameServerTribeDocument = HydratedDocument<GameServerTribe>;
export const GameServerTribeSchema = SchemaFactory.createForClass(GameServerTribe);
GameServerTribeSchema.index({ server: 1, Id: 1 }, { unique: true });
