import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { GameServer } from './game-server.schema';

@Schema({ timestamps: true, collection: 'players' })
export class GameServerPlayer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: GameServer.name, required: true })
  server: mongoose.Types.ObjectId;

  @Prop({ required: true })
  game: string;

  @Prop({ required: true })
  collectedAt: Date;

  @Prop()
  PlayerName: string;

  @Prop()
  Level: number;

  @Prop()
  TotalEngramPoints: number;

  @Prop()
  CharacterName: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  TribeId: number | boolean;

  @Prop()
  EosId: string;

  @Prop({ required: true })
  PlayerId: number;

  @Prop()
  SteamId: string;

  @Prop()
  FileCreated: string;

  @Prop()
  FileUpdated: string;
}

export type GameServerPlayerDocument = HydratedDocument<GameServerPlayer>;
export const GameServerPlayerSchema = SchemaFactory.createForClass(GameServerPlayer);
GameServerPlayerSchema.index({ server: 1, PlayerId: 1 }, { unique: true });
