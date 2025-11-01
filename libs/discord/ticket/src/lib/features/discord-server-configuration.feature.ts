import { getRepository } from 'typeorm';
import { Collection, Message } from 'discord.js';

import { TicketConfiguration } from '../entities/ticket-configuration.entity';

export class TicketServerConfiguration {
  private _config: DiscordTicketServerConfigurationProperties = {
    category: 'tickets',
    notifyRole: 'admin',
    sudoers: [],
    notifiers: [],
    templateMessage: '',
    permissionOverrides: [],
    logChannelId: '',
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

  public updateFromModalData(data: Partial<DiscordTicketServerConfigurationProperties>) {
    if (data.category !== undefined) this._config.category = data.category;
    if (data.notifyRole !== undefined) this._config.notifyRole = data.notifyRole;
    if (data.sudoers !== undefined) this._config.sudoers = data.sudoers;
    if (data.notifiers !== undefined) this._config.notifiers = data.notifiers;
    if (data.templateMessage !== undefined) this._config.templateMessage = data.templateMessage;
    if (data.permissionOverrides !== undefined) this._config.permissionOverrides = data.permissionOverrides;
    if (data.logChannelId !== undefined) this._config.logChannelId = data.logChannelId;
  }

  public async save() {
    try {
      const repo = getRepository(TicketConfiguration);

      const existing = await repo.findOne({
        where: {
          serverId: this._config.serverId,
        },
      });

      if (existing) {
        existing.config = {
          category: this._config.category,
          notifyRole: this._config.notifyRole,
          sudoers: this._config.sudoers,
          notifiers: this._config.notifiers,
          templateMessage: this._config.templateMessage,
          permissionOverrides: this._config.permissionOverrides,
          logChannelId: this._config.logChannelId,
        };
        existing.updatedAt = new Date();
        return await repo.save(existing);
      } else {
        return await repo.insert({
          config: {
            category: this._config.category,
            notifyRole: this._config.notifyRole,
            sudoers: this._config.sudoers,
            notifiers: this._config.notifiers,
            templateMessage: this._config.templateMessage,
            permissionOverrides: this._config.permissionOverrides,
            logChannelId: this._config.logChannelId,
          },
          serverId: this._config.serverId,
        });
      }
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
  sudoers: string[];
  notifiers: string[];
  templateMessage: string;
  permissionOverrides: string[];
  logChannelId: string;
}
