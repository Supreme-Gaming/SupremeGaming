# Supreme Gaming Discord Community Bot (NodeJS)

This bot serves the Supreme Gaming Discord community with game info, member onboarding, role assignment, and server moderation.

## Features

| Feature | Description |
|---|---|
| Game info | Slash commands (`/ark`, `/atlas`, `/conan`) returning templated help info for each game |
| General help | `/help` command with an overview of bot capabilities |
| Donations | `/donate` command with donation methods and perks |
| Welcome messages | Automatically greets new members when they join the server |
| Role assignment | Assigns and removes game roles via emoji reactions in the roles channel |
| Fun commands | `/random` for miscellaneous fun commands |
| Honeypot | Auto-bans bot/spam accounts that post in a designated trap channel and reports actions to a mod channel — see [`@supremegaming/discord/honeypot`](../../libs/discord/honeypot/README.md) |

## Libraries

- [`@supremegaming/discord/community`](../../libs/discord/community/README.md) — all community feature modules
- [`@supremegaming/discord/honeypot`](../../libs/discord/honeypot/README.md) — honeypot ban system
- [`@supremegaming/discord/bootstrap`](../../libs/discord/bootstrap/src/index.ts) — Discord client bootstrapper and shared utilities
