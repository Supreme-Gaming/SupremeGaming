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

## Configuration

Copy `.env.sample` to `.env` and fill in the values.

### Discord

| Variable | Description |
|---|---|
| `DISCORD_API_TOKEN` | Bot token from the Discord Developer Portal |
| `DISCORD_BOT_ID` | Application/client ID of the bot |
| `DISCORD_GUILD_ID` | ID of the Discord server (used for guild-scoped slash command registration) |
| `DISCORD_ROLE_CHANNEL_NAME` | Name of the channel where emoji reaction role assignment is active |
| `DISCORD_WELCOME_CHANNEL_NAME` | Name of the channel where new member welcome messages are sent |

### Database (required by the honeypot module)

| Variable | Description |
|---|---|
| `TYPEORM_CONNECTION` | Database driver — use `mysql` |
| `TYPEORM_HOST` | Database host |
| `TYPEORM_PORT` | Database port — default `3306` |
| `TYPEORM_USERNAME` | Database username |
| `TYPEORM_PASSWORD` | Database password |
| `TYPEORM_DATABASE` | Database name |
| `TYPEORM_SYNCHRONIZE` | Set to `true` on first run to auto-create tables, then revert to `false` |
| `TYPEORM_DROP_SCHEMA` | Drop and recreate schema on startup — keep `false` in production |
| `TYPEORM_LOGGING` | Enable TypeORM query logging |
| `TYPEORM_DRIVER_EXTRA` | Additional driver options (JSON) |

### Optional

| Variable | Description |
|---|---|
| `DISCORD_REGISTER_SLASH_COMMANDS` | Set to `false` to skip slash command registration on startup. Discord enforces a daily creation limit, so disable this during local development. See [command deployment docs](https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration). |

## Libraries

- [`@supremegaming/discord/community`](../../libs/discord/community/README.md) — all community feature modules
- [`@supremegaming/discord/honeypot`](../../libs/discord/honeypot/README.md) — honeypot ban system
- [`@supremegaming/discord/bootstrap`](../../libs/discord/bootstrap/src/index.ts) — Discord client bootstrapper and shared utilities
