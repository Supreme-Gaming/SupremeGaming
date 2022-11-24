import { discordTicket } from './discord-ticket';

describe('discordTicket', () => {
  it('should work', () => {
    expect(discordTicket()).toEqual('discord-ticket');
  });
});
