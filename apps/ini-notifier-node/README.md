# ini-notifier-node

Fetches an INI file from a URL, parses and caches it, polls for changes, and posts diffs to a Discord webhook.

## Environment variables

See [.env.sample](.env.sample) for a sample configuration file with all available environment variables and their descriptions.

## Develop

- Build: `npx nx run ini-notifier-node:build:production`
- Run: `npx nx run ini-notifier-node:serve`

Copy `.env.sample` to `.env` and configure the required variables, or export them in your shell.

## Notes

- Uses ETag (If-None-Match) when available to avoid unnecessary downloads.
- Initial fetch seeds the cache without sending a notification; subsequent changes trigger diffs.
- Cache data is persisted to disk to survive application restarts and prevent duplicate notifications after crashes.
- The cache directory is automatically created if it doesn't exist.
- On startup, notifications for changes (whether first run or cached data differs from remote) are controlled by NOTIFY_ON_STARTUP.
