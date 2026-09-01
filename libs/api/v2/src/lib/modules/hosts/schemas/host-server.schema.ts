import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Subdocument schemas (no _id for embedded docs)

@Schema({ _id: false })
export class CpuInfo {
  @Prop() model: string;
  @Prop() cores: number;
  @Prop() speedMhz: number;
}

@Schema({ _id: false })
export class MemoryInfo {
  @Prop() totalBytes: number;
  @Prop() freeBytes: number;
}

@Schema({ _id: false })
export class DiskInfo {
  @Prop() path: string;
  @Prop() totalBytes: number;
  @Prop() freeBytes: number;
  @Prop() availableBytes: number;
}

@Schema({ _id: false })
export class NetworkAddress {
  @Prop() address: string;
  @Prop() family: string;
  @Prop() internal: boolean;
  @Prop() mac: string;
}

@Schema({ _id: false })
export class NetworkInterfaceInfo {
  @Prop() name: string;
  @Prop({ type: [NetworkAddress] }) addresses: NetworkAddress[];
}

@Schema({ _id: false })
export class NetworkInfo {
  @Prop({ type: [NetworkInterfaceInfo] }) interfaces: NetworkInterfaceInfo[];
  @Prop({ type: String, default: null }) publicIp: string | null;
}

@Schema({ _id: false })
export class OsInfo {
  @Prop() platform: string;
  @Prop() release: string;
  @Prop() arch: string;
}

@Schema({ _id: false })
export class SystemInfo {
  @Prop({ type: CpuInfo }) cpu: CpuInfo;
  @Prop({ type: MemoryInfo }) memory: MemoryInfo;
  @Prop({ type: [DiskInfo] }) disks: DiskInfo[];
  @Prop({ type: NetworkInfo }) network: NetworkInfo;
  @Prop() hostname: string;
  @Prop({ type: OsInfo }) os: OsInfo;
}

// Root schema

@Schema({ timestamps: true, collection: 'host_servers' })
export class HostServer {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ unique: true, sparse: true })
  agentId: string;

  @Prop({ default: 'register' })
  status: string;

  @Prop()
  hostname: string;

  @Prop({ type: SystemInfo })
  system: SystemInfo;

  @Prop()
  timestamp: string;

  @Prop({ type: Date, default: null })
  lastHeartbeat: Date;

  @Prop()
  registeredBy: string;

  @Prop({ type: Date, default: null })
  lastTokenRefresh: Date;
}

export type HostServerDocument = HydratedDocument<HostServer>;
export const HostServerSchema = SchemaFactory.createForClass(HostServer);
