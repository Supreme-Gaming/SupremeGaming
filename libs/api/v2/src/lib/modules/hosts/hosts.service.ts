import { Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateHostServerDto } from './dto/create-host-server.dto';
import { HostServer, HostServerDocument } from './schemas/host-server.schema';

@Injectable()
export class HostsService {
  private readonly logger = new Logger(HostsService.name);

  constructor(@InjectModel(HostServer.name) private readonly model: Model<HostServerDocument>) {}

  public async getHostServers() {
    return this.model.find().exec();
  }

  public async getHostByAgentId(agentId: string) {
    return this.model.findOne({ $or: [{ key: agentId }, { agentId }] }).exec();
  }

  public async createHostServer(server: CreateHostServerDto) {
    if (!server.key) {
      throw new UnprocessableEntityException();
    }

    // Find an existing host by its registration key
    let existingOrNew = await this.model.findOne({ key: server.key }).exec();

    // If no host has been found, create a new one else just return the existing host
    if (!existingOrNew) {
      try {
        existingOrNew = await new this.model(server).save();
      } catch (err) {
        throw new InternalServerErrorException(err.message);
      }
    }

    return existingOrNew;
  }

  public async registerHost(payload: { key: string; hostname: string; system: any; timestamp: string }) {
    if (!payload.key) {
      throw new UnprocessableEntityException('Registration key is required');
    }

    let host = await this.model.findOne({ key: payload.key }).exec();

    if (!host) {
      host = new this.model({
        key: payload.key,
        hostname: payload.hostname,
        system: payload.system,
        status: 'ready',
        timestamp: payload.timestamp,
        lastHeartbeat: new Date(),
      });
      await host.save();
    } else {
      host.hostname = payload.hostname;
      host.system = payload.system;
      host.status = 'ready';
      host.timestamp = payload.timestamp;
      host.lastHeartbeat = new Date();
      await host.save();
    }

    this.logger.log(`Host registered: ${payload.key} (status: ready)`);
    return host;
  }

  public async processHeartbeat(key: string, system: any) {
    const host = await this.model.findOne({ key }).exec();
    if (!host) {
      this.logger.warn(`Heartbeat from unknown host: ${key}`);
      return;
    }

    host.system = system;
    host.lastHeartbeat = new Date();
    await host.save();
  }

  public async setHostOffline(key: string) {
    await this.model.findOneAndUpdate({ key }, { status: 'offline' }).exec();
    this.logger.log(`Host offline: ${key}`);
  }
}
