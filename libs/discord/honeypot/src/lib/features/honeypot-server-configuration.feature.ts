import { getRepository } from 'typeorm';

import { HoneypotConfiguration } from '../entities/honeypot-configuration.entity';

export interface HoneypotServerConfigurationProperties {
  serverId?: string;
  sudoers: string[];
  honeypotChannelId: string;
  reportingChannelId: string;
  warningMessageId?: string;
}

export class HoneypotServerConfiguration {
  public fromDb = false;

  private _config: HoneypotServerConfigurationProperties = {
    sudoers: [],
    honeypotChannelId: '',
    reportingChannelId: '',
    warningMessageId: undefined,
  };

  constructor(serverId: string) {
    if (!serverId) throw new Error('No server ID provided.');
    this._config.serverId = serverId;
  }

  public get value(): HoneypotServerConfigurationProperties {
    return { ...this._config };
  }

  public updateFromData(data: Partial<HoneypotServerConfigurationProperties>): void {
    if (data.sudoers !== undefined) this._config.sudoers = data.sudoers;
    if (data.honeypotChannelId !== undefined) this._config.honeypotChannelId = data.honeypotChannelId;
    if (data.reportingChannelId !== undefined) this._config.reportingChannelId = data.reportingChannelId;
    if (data.warningMessageId !== undefined) this._config.warningMessageId = data.warningMessageId;
  }

  public async fetch(): Promise<this> {
    try {
      const repo = getRepository(HoneypotConfiguration);

      const dbRecord = await repo.findOne({ where: { serverId: this._config.serverId } });

      if (dbRecord) {
        this.fromDb = true;
        const stored = dbRecord.config as Partial<HoneypotServerConfigurationProperties>;

        this._config = {
          ...this._config,
          sudoers: stored.sudoers ?? this._config.sudoers,
          honeypotChannelId: stored.honeypotChannelId ?? this._config.honeypotChannelId,
          reportingChannelId: stored.reportingChannelId ?? this._config.reportingChannelId,
          warningMessageId: stored.warningMessageId,
        };
      }

      return this;
    } catch (err) {
      console.error('[Honeypot] Error fetching server configuration:', err);
      throw new Error('Error fetching honeypot server configuration.');
    }
  }

  public async save(): Promise<void> {
    try {
      const repo = getRepository(HoneypotConfiguration);

      const existing = await repo.findOne({ where: { serverId: this._config.serverId } });

      const configPayload = {
        sudoers: this._config.sudoers,
        honeypotChannelId: this._config.honeypotChannelId,
        reportingChannelId: this._config.reportingChannelId,
        warningMessageId: this._config.warningMessageId,
      };

      if (existing) {
        existing.config = configPayload;
        existing.updatedAt = new Date();
        await repo.save(existing);
      } else {
        await repo.insert({
          serverId: this._config.serverId,
          config: configPayload,
        });
      }
    } catch (err) {
      console.error('[Honeypot] Error saving server configuration:', err);
      throw new Error('Error saving honeypot server configuration.');
    }
  }
}
