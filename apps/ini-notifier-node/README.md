# ini-notifier-node

Fetches an INI file from a URL, parses and caches it, polls for changes, and posts diffs to a Discord webhook.

## Environment variables

- INI_URL: URL of the remote INI file to monitor (required)
- DISCORD_WEBHOOK_URL: Discord webhook URL to post change notifications (required)
- POLL_INTERVAL_MS: Polling interval in milliseconds (default: 60000)
- REQUEST_TIMEOUT_MS: HTTP request timeout in milliseconds (default: 15000)
- NOTIFIER_NAME: Username to display for the webhook (default: ini-notifier)
- NOTIFY_ON_STARTUP: If true, send notifications for changes detected on startup (first run or when cached data differs from remote) (default: false)
- CACHE_DIR: Directory path to store cached INI data on disk (default: ./cache)
- EMBED_TITLE: Title for the Discord embed (default: "INI Changes Detected")
- EMBED_COLOR: Hex color code for the Discord embed (default: ffa500)

## Develop

- Build: nx build ini-notifier-node
- Run: nx serve ini-notifier-node

Place a `.env` file in the workspace root or export the variables in your shell.

## Notes

- Uses ETag (If-None-Match) when available to avoid unnecessary downloads.
- Initial fetch seeds the cache without sending a notification; subsequent changes trigger diffs.
- Cache data is persisted to disk to survive application restarts and prevent duplicate notifications after crashes.
- The cache directory is automatically created if it doesn't exist.
- On startup, notifications for changes (whether first run or cached data differs from remote) are controlled by NOTIFY_ON_STARTUP.
