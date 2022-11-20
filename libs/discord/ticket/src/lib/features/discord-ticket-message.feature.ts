import { Message, TextChannel, MessageAttachment, PartialMessage } from 'discord.js';
import { Repository, getRepository } from 'typeorm';

import { TicketEntity } from '../entities/ticket.entity';
import { TicketMessageEntity } from '../entities/ticket-message.entity';

import { DiscordServerTicketMessageAttachment } from './discord-ticket-message-attachment.feature';

export class TicketMessage {
  private _repo: Repository<TicketMessageEntity>;
  private _type: DiscordTicketMessageConstructorOptions['type'];

  private _messageContent: string;
  private _messageAttachments: Array<MessageAttachment>;
  private _messageId: number;
  private _createdBy: number;
  private _authorName: string;
  private _channelId: number;
  private _serverId: number;

  private _channelName: string;

  constructor(message: Message | PartialMessage, type: DiscordTicketMessageConstructorOptions['type']) {
    this._repo = getRepository(TicketMessageEntity);
    this._type = type;

    this.applyMetadata(message);
  }

  public async init() {
    // Check if message originated from a ticket channel.
    // We don't care about messages outside ticket channels.
    if (!this.originTicketChannel()) {
      return;
    }

    if (this._type === 'create') {
      this.createTicketMessage();
    } else if (this._type === 'edit') {
      this.updateTicketMessage();
    } else if (this._type === 'delete') {
      this.deleteTicketMessage();
    }
  }

  private async applyMetadata(message: Message | PartialMessage) {
    this._channelName = (message.channel as TextChannel).name;

    this._messageId = parseInt(message.id);
    this._messageContent = message.cleanContent;

    this._messageAttachments = message.attachments.map((a) => a);

    this._channelId = parseInt(message.channel.id);
    this._serverId = parseInt(message.guild.id);

    // Check if the message has a valid author. Bot's might not populate this property.
    if (message.author === null) {
      return;
    }

    if (message.author.partial) {
      await message.author.fetch();
    }

    this._createdBy = parseInt(message.author.id);
    this._authorName = message.author.username;
  }

  private async createTicketMessage() {
    try {
      const existingTicket = await this.getExistingDbTicket();

      // the server id and channel id, insert new ticket message into db.
      if (existingTicket) {
        this._repo.insert({
          content: this._messageContent,
          createdBy: this._createdBy,
          authorName: this._authorName,
          messageId: this._messageId,
          serverId: this._serverId,
          ticketId: existingTicket.ticketId,
        });

        // Process any attachments in the message
        if (this._messageAttachments.length > 0) {
          new DiscordServerTicketMessageAttachment(this._serverId, this._messageId, this._messageAttachments).insert();
        }
      }
    } catch (err) {
      console.log(err);
      throw new Error('Error creating ticket message row.');
    }
  }

  /**
   * Attempts to update the `edited` column of an existing db ticket message.
   *
   * This also updates the content field.
   */
  private async updateTicketMessage() {
    try {
      const existingMessage = await this.getExistingDbMessage();

      if (existingMessage) {
        existingMessage.edited = true;
        existingMessage.content = this._messageContent;
        existingMessage.updatedAt = new Date();

        getRepository(TicketMessageEntity).save(existingMessage);
      }
    } catch (err) {
      console.log(err);
      throw new Error('Error updating ticket message.');
    }
  }

  /**
   * Attempts to update the `deleted` column of an existing db ticket message.
   */
  private async deleteTicketMessage() {
    try {
      const existingMessage = await this.getExistingDbMessage();

      if (existingMessage) {
        existingMessage.deleted = true;
        existingMessage.updatedAt = new Date();

        getRepository(TicketMessageEntity).save(existingMessage);
      }
    } catch (err) {
      console.log(err);
      throw new Error('Error deleting ticket message.');
    }
  }

  /**
   * Checks if the channel name contains a prefix.
   *
   * Since all ticket channels are named with a known prefix, if the message
   * channel name contains the prefix, we should treat the message as actionable
   * by this class.
   *
   */
  private originTicketChannel() {
    return this._channelName.includes('ticket-');
  }

  /**
   * Finds an existing db ticket by server id and channel id, if any.
   *
   * Server ID and Channel ID represent a compound primary key.
   */
  private async getExistingDbTicket() {
    return await getRepository(TicketEntity).findOne({
      serverId: this._serverId,
      channelId: this._channelId,
    });
  }

  /**
   * Finds an existing db ticket message by server id and message id, if any.
   *
   * Both values are assumed to be present in class state since this method is only called
   * when updating/deleting actions occur.
   *
   * @private
   * @returns
   * @memberof DiscordServerTicketMessage
   */
  private async getExistingDbMessage() {
    return this._repo.findOne({
      serverId: this._serverId,
      messageId: this._messageId,
    });
  }
}

export interface DiscordTicketMessageConstructorOptions {
  type: 'create' | 'edit' | 'delete';
}
