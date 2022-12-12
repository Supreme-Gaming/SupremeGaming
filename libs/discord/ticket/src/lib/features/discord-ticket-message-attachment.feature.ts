import { getRepository, Repository } from 'typeorm';
import { TicketAttachment } from '../entities/ticket-attachment.entity';
import { MessageAttachment } from 'discord.js';

export class DiscordServerTicketMessageAttachment {
  private _repo: Repository<TicketAttachment>;

  private _serverId: string;
  private _messageId: string;

  private _attachments: MessageAttachment[];

  constructor(serverId: string, messageId: string, attachments: MessageAttachment[]) {
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
