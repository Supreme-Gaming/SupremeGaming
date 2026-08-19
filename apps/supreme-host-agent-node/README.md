## Supreme Gaming Host Agent

This agent is to be installed on hosts that run supported game servers. It is a **private Socket.IO client** to the Supreme Gaming control plane — not a public HTTP server, and not something to put behind a reverse proxy for the Web UI.

The UI never talks to agents directly. Users issue commands on the API; the API delivers them over the `/hosts` namespace and streams progress back.

```
UI --REST/SSE--> API control plane --Socket.IO /hosts--> this agent
```

## Purpose

The agent is responsible for:

- Registering the host server with the control plane
- Sending regular heartbeats so the control plane knows the host is alive
- Receiving commands from the control plane (directory listing today; configure / start / stop / restart later)
- Reporting command progress and results back over the same socket
- Registering individual game server instances and producing data for supported game types (planned)

## Control-plane channel

After machine auth (REST `POST /agents/register` or token refresh), the process connects with `socket.io-client` to `{API_URL origin}/hosts`. That namespace is **not** under the REST `/api` prefix. Handshake auth is `{ token, agentId }`.

On connect it emits `register` (hostname + system info) and then heartbeats every 5s via a local BullMQ scheduler (Redis on the host, not the control-plane bus).

### Commands

The API emits `command`; this process runs it and emits `command:progress`. Wiring is in `src/commands.ts` (`attachCommandHandlers`).

Lifecycle: `accepted` → `running` (optional percent) → `succeeded` | `failed` | `rejected`.

| `type` | What it does |
| --- | --- |
| `list-directory` | List a directory (names, types, sizes, mtimes — not file contents) |

Optional env `AGENT_FS_ROOT`: if set, listings outside that directory are rejected.

To add work such as start/stop/restart, register another handler on the dispatcher — same envelope, no new socket:

```ts
dispatcher.register('start-game-server', handler);
```

Shared types and the dispatcher live in [`@supremegaming/agent`](../../libs/agent/README.md). HTTP/SSE for the UI live in [`@supremegaming/api/v2`](../../libs/api/v2/README.md).

### Environment

See `.env.sample`. Required: `AGENT_ID`, `API_URL`. First boot also needs `REGISTRATION_TOKEN`. Redis (`REDIS_HOST` / `REDIS_PORT`) is for the local heartbeat scheduler.

## Agent registration mechanism

This agent will be published as either a docker container image or a binary executable hosted on GitHub as a release.

The UI will provide an installation script that either pulls the container image and runs with defaults + a generated registration token, or downloads the binary and runs the same way.

On registration, the agent sends:

- System information (CPU, RAM, Disk, Network)
- Hostname
- IP address

## Game server management

The control plane will send game-server configuration over this same command channel (directory browsing from the Web UI is the first concrete command). Intended fields include:

- Game server type (ark-se, ark-sa, conan, atlas, etc.)
- Public IP (inherited from host or custom)
- Port configuration (game, query, rcon, etc.)
- Server name (optionally auto-discovered from game ini)
- RCON password (optionally auto-discovered from game ini)
- Game server installation directory (optionally auto-discovered from common install paths)
- Whether game data should be parsed and uploaded to the control plane for display in the Web UI (player/tribe parsing, using ark-files library)
