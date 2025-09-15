# SupremeGaming

Work-in-progress monorepo for all of Supreme Gaming's data services. All of the projects and applications are written using TypeScript in a flavor of frameworks (NestJS for backend, Angular for front-end).

All of our existing services are held in private repositories in embarrassing states so not all are available here yet but will slowly be.

## Working services/applications

- `supreme-discord-community-bot-node`
  - Provides templated messages accessible through slash commands for the most commonly asked information, focused on community general help, reference, and FAQ. This bot is tailored for the Supreme Gaming community but can be adapted for similar use cases. [Read more](apps/supreme-discord-community-bot-node/README.md)
- `supreme-discord-ticket-bot-node`
  - Simple ticketing system accessible through guild slash commands, allowing users to create and request individual assistance while enabling server owners to maintain control of their data. [Read more](apps/supreme-discord-ticket-bot-node/README.md)
- `ini-notifier-node`
  - Fetches an INI file from a URL, parses and caches it, polls for changes, and posts diffs to a Discord webhook for real-time notifications. [Read more](apps/ini-notifier-node/README.md)

## Non-working/WIP services/applications

- Supreme Gaming website
- Supreme Gaming data api
- Ark data caching service (re-written in TS and built on top of [knightzac19's](https://github.com/knightzac19/NodeJS-ArkData).
- Donation processing services (patreon and paypal)
