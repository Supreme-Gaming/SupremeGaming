# discord-honeypot

Automated honeypot system for detecting and banning bot/spam accounts on a Discord server. Designates a channel as a trap — any non-exempt user who posts in it is immediately and permanently banned, and a report is sent to a configured mod channel for admin review.

## Features

- **Honeypot channel** — posts and pins a warning embed on startup explaining the channel's purpose. The warning is re-checked hourly and reposted if deleted.
- **Auto-ban** — bans any non-sudoer who posts in the honeypot channel, deleting their recent messages.
- **Ban report** — sends an embed to the reporting channel with the user's name, account age, and the triggering message content, along with Confirm Ban / Revert Ban action buttons.
- **`/honeypot-config`** — admin slash command to configure the honeypot channel, reporting channel, and sudoers list (users/roles exempt from the ban).

## Configuration

Run `/honeypot-config` in Discord (requires Administrator permission) to set:

| Setting | Description |
|---|---|
| Honeypot channel | The trap channel. The bot posts a pinned warning here. |
| Reporting channel | Where ban reports and action buttons are sent. |
| Sudoers | Users or roles that are exempt from the honeypot ban. Guild owner is always exempt. |

## Setup

Requires a MySQL database via the standard `TYPEORM_*` environment variables. Set `TYPEORM_SYNCHRONIZE=true` on first run to auto-create the `honeypot_configuration` table, then switch back to `false`.

## Running unit tests

Run `nx test discord-honeypot` to execute the unit tests via [Jest](https://jestjs.io).
