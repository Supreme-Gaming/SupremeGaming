import { getRepository, Repository } from 'typeorm';
import { TicketEntity } from '../entities/ticket.entity';
import { ButtonInteraction, CacheType, CommandInteraction } from 'discord.js';

import * as guid from 'uuid/v4';

export class Ticket {
  private _repo: Repository<TicketEntity>;
  private _serverId: string;
  private _seq: string;
  private _createdBy: string;
  private _channelId: string;

  /**
   * This is set to true once the ticket insertion query has finished.
   *
   * @memberof DiscordServerTicket
   */
  public isCreated = false;
  public isClosed = false;

  constructor(interaction: CommandInteraction<CacheType> | ButtonInteraction<CacheType>) {
    this._repo = getRepository(TicketEntity);
    this._serverId = interaction.guild.id;
    this._createdBy = interaction.user.id;

    if ((interaction.channel as any).name.includes('ticket')) {
      this.channelId = interaction.channel.id;
    }
  }

  public async init() {
    // Only get database sequence if there is no channel ID.
    //
    // If there is a channel ID defined, it means the ticket is being closed,
    // or the channel ID has been added after the actual discord ticket has been made.
    // If the latter is case, we don't want to overrride an existing value.
    if (this._channelId == undefined) {
      const seq = await this.getDbSequence();

      this._seq = seq;
      return this;
    } else {
      return this;
    }
  }

  public async create() {
    await this._repo.insert({
      ticketId: guid(),
      serverId: this._serverId,
      serverSequence: this._seq,
      createdBy: this._createdBy,
      channelId: this._channelId,
    });

    this.isCreated = true;

    return this;
  }

  public async close() {
    const ticketToClose = await this._repo.findOne({
      where: {
        serverId: this._serverId,
        channelId: this._channelId,
      },
    });

    if (ticketToClose) {
      ticketToClose.status = 'closed';
      ticketToClose.updatedAt = new Date();
      await this._repo.save(ticketToClose);
      this.isClosed = true;
      return this;
    } else {
      return this;
    }
  }

  /**
   * This is used for rollback procedures. Do not close a ticket if a user has issued
   * a `close` command. Use `close()` method instead, as it will only update the ticket status.
   *
   * @returns
   * @memberof DiscordServerTicket
   */
  public async delete() {
    await this._repo.delete({ serverId: this._serverId, serverSequence: this._seq });

    return this;
  }

  public get channelName(): string {
    const ticketNumber = this._seq.toString().padStart(4, '0');
    return `ticket-${ticketNumber}`;
  }

  public set channelId(id: string) {
    this._channelId = id;
  }

  private async getDbSequence() {
    const seq = await this._repo
      .createQueryBuilder()
      .select('MAX(serverSequence) as val')
      .where('serverId = :serverId', { serverId: this._serverId })
      .execute();

    if (seq.length > 0 && seq[0].val !== null) {
      const curr = seq[0].val;
      return (parseInt(curr) + 1).toString();
    } else {
      return '1';
    }
  }
}
