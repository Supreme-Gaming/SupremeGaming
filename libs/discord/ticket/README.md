# Discord Client Feature Module

Feature module that provides the business logic for the `supreme-discord-ticket-bot-node` app.

## Available Slash Commands

- `/ticket new`
  - Creates a new ticket under the ticket category.
- `/ticket close`
  - Emits an actionable message allowing any readers of the ticket channel to press the bound buttons to close the message.
- `/ticket add`
  - Planned feature to add a discord guild member to the ticket.
- `/ticket remove`
  - Planed feature to remove a ticket reader from the ticket channel.
- `/ticket setup`
  - Planned feature. Used trigger the initial ticket bot setup/settings edit. Was previously implemented via prefixed commands but has not been implemented with slash commands.
