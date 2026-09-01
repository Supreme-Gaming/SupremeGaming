import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { HostServer } from '../../hosts/schemas/host-server.schema';

@Schema({ timestamps: true, collection: 'game_servers' })
export class GameServer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: HostServer.name, required: true })
  host: mongoose.Types.ObjectId;

  @Prop({ required: true })
  port: number;

  @Prop({ required: true })
  rconport: number;

  @Prop({ required: true })
  rconpass: string;

  @Prop({ default: false })
  shouldProcess: boolean;

  @Prop()
  server_directory: string;

  @Prop()
  server_alt_dir: string;

  @Prop()
  map_name: string;

  @Prop({ required: true })
  game: string;
}

export type GameServerDocument = HydratedDocument<GameServer>;
export const GameServerSchema = SchemaFactory.createForClass(GameServer);
