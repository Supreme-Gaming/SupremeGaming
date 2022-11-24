import { discordBootstrap } from './discord-bootstrap';

describe('discordBootstrap', () => {
  it('should work', () => {
    expect(discordBootstrap()).toEqual('discord-bootstrap');
  });
});
