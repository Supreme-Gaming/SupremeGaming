import { getRepository } from 'typeorm';
import { Collection, Message } from 'discord.js';

import { TicketConfiguration } from '../entities/ticket-configuration.entity';

export class TicketServerConfiguration {
  private _config: DiscordTicketServerConfigurationProperties = {
    category: 'tickets',
    notifyRole: 'admin',
  };
  public fromDb = false;
  constructor(serverId: string) {
    if (serverId) {
      this._config.serverId = serverId;
    } else {
      throw new Error('No server ID provided.');
    }
  }

  public set category(response: Collection<string, Message>) {
    this._config.category = response.first().content;
    this._config.serverId = response.first().guild.id;
  }

  public set notifyRole(response: Collection<string, Message>) {
    this._config.notifyRole = response.first().cleanContent.replace('@', '');
    this._config.serverId = response.first().guild.id;
  }

  public get value() {
    return { ...this._config };
  }

  public async save() {
    try {
      const repo = getRepository(TicketConfiguration);

      return await repo.insert({
        config: {
          category: this._config.category,
          notifyRole: this._config.notifyRole,
        },
        serverId: this._config.serverId,
      });
    } catch (err) {
      console.log(err);
      throw new Error('Error saving ticket server configuration.');
    }
  }

  public async fetch() {
    try {
      const repo = getRepository(TicketConfiguration);

      const dbConfig = await repo.findOne({
        where: {
          serverId: this._config.serverId,
        },
      });

      if (dbConfig) {
        this.fromDb = true;
        this._config = { ...(dbConfig.config as any) };
      }

      return this;
    } catch (err) {
      console.log(err);
      throw new Error('Error getting server configuration from database');
    }
  }
}

export interface DiscordTicketServerConfigurationProperties {
  category: string;
  notifyRole: string;
  serverId?: string;
}
