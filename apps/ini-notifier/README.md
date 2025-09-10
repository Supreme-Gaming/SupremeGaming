# ini-notifier

Fetches an INI file from a URL, parses and caches it, polls for changes, and posts diffs to a Discord webhook.

## Environment variables

- INI_URL: URL of the remote INI file to monitor (required)
- DISCORD_WEBHOOK_URL: Discord webhook URL to post change notifications (required)
- POLL_INTERVAL_MS: Polling interval in milliseconds (default: 60000)
- REQUEST_TIMEOUT_MS: HTTP request timeout in milliseconds (default: 15000)
- NOTIFIER_NAME: Username to display for the webhook (default: ini-notifier)
- NOTIFY_ON_INITIAL: If true, send a webhook for the initially cached INI showing all keys as added (default: false)

## Develop

- Build: nx build ini-notifier
- Run: nx serve ini-notifier

Place a `.env` file in the workspace root or export the variables in your shell.

## Notes

- Uses ETag (If-None-Match) when available to avoid unnecessary downloads.
- Initial fetch seeds the cache without sending a notification; subsequent changes trigger diffs.
