import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HostServer } from '@supremegaming/common/entities/servers';

@Injectable()
export class HostsService {
  constructor(@InjectRepository(HostServer) private readonly repo: Repository<HostServer>) {}

  public async getHostServers() {
    return this.repo.find();
  }

  public async createHostServer(server: Partial<HostServer>) {
    if (!server.key) {
      throw new UnprocessableEntityException();
    }

    let existingOrNew: HostServer;

    // Find an existing host by its registration key
    existingOrNew = await this.repo.findOne({
      where: {
        key: server.key,
      },
    });

    // If no host has been found, create a new one else just return the existing host
    if (!existingOrNew) {
      try {
        existingOrNew = await this.repo.create(server).save();
      } catch (err) {
        throw new InternalServerErrorException(err.message);
      }
    }

    return existingOrNew;
  }
}
