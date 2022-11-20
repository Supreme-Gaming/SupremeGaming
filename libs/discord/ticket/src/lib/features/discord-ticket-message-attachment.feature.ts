import { getRepository, Repository } from 'typeorm';
import { TicketAttachment } from '../entities/ticket-attachment.entity';
import { MessageAttachment } from 'discord.js';

export class DiscordServerTicketMessageAttachment {
  private _repo: Repository<TicketAttachment>;

  private _serverId: number;
  private _messageId: number;

  private _attachments: MessageAttachment[];

  constructor(serverId: number, messageId: number, attachments: MessageAttachment[]) {
    this._repo = getRepository(TicketAttachment);

    this._serverId = serverId;
    this._messageId = messageId;
    this._attachments = attachments;
  }

  public insert() {
    const mult = this._attachments.map((attachment) => {
      return {
        serverId: this._serverId,
        messageId: this._messageId,
        name: attachment.name,
        cdnUrl: attachment.url,
        proxyUrl: attachment.proxyURL,
      };
    });

    this._repo.insert(mult);
  }
}
