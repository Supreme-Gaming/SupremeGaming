import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { HostServer, HostServerDocument } from './schemas/host-server.schema';

@Injectable()
export class HostsService {
  constructor(@InjectModel(HostServer.name) private readonly model: Model<HostServerDocument>) {}

  public async getHostServers() {
    return this.model.find().exec();
  }

  public async createHostServer(server: Partial<HostServer>) {
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
}
