## Supreme Gaming Host Agent

This agent is to be installed on hosts that run supported game servers. It is a **private Socket.IO client** to the Supreme Gaming control plane — not a public HTTP server, and not something to put behind a reverse proxy for the Web UI.

The UI never talks to agents directly. Users issue commands on the API; the API delivers them over the `/hosts` namespace and streams progress back.

```
UI --REST/SSE--> API control plane --Socket.IO /hosts--> this agent
                                        |
                                        +-- HTTP POST /api/servers/:id/game-data --> API --> Mongo
```

## Purpose

The agent's **primary role** is to collect game data (world, player, tribe) from game servers on the host and send it to the control plane.

This first job covers **players and tribes only**. [@supremegaming/ark-files](https://www.npmjs.com/package/@supremegaming/ark-files) does not parse `.ark` world saves.

The process also:

- Registers the host server with the control plane
- Sends regular heartbeats so the control plane knows the host is alive
- Receives commands from the control plane (directory listing, on-demand / cancel game-data jobs)
- Reports command progress and results back over the same socket

## Control-plane channel

After machine auth (REST `POST /agents/register` or token refresh), the process connects with `socket.io-client` to `{API_URL origin}/hosts`. That namespace is **not** under the REST `/api` prefix. Handshake auth is `{ token, agentId }`.

On connect it emits `register` (hostname + system info) and then heartbeats every 5s via a local BullMQ scheduler. Redis on the host is used for **heartbeat and game-data jobs** (not the control-plane bus).

The control plane also emits `configuration` (on connect, register, and after game-server create / update / delete) so schedule changes apply without a reconnect.

### Game-data jobs

First game type string: **`ark-ascended`** (ARK: Survival Ascended).

A per-server BullMQ scheduler (`host-agent-jobs`, separate from `host-agent-heartbeat`) is upserted when configuration has `game === 'ark-ascended'`, `shouldProcess === true`, and `server_directory` is set. It is removed when those stop matching. Default interval is every 5 minutes (`GAME_DATA_INTERVAL_MS`, default `300000`).

`server_directory` is the absolute path to the save files directory (typically `SavedArks`, or an `AltSaveDirectoryName` folder). `@supremegaming/ark-files` is constructed with `absolutePath: true` so it reads that path as-is instead of appending `ShooterGame/Saved/SavedArks`. Each run is `new ArkFiles(server_directory, 0, ArkBinaryFormats.ASA, true)` (fresh read, ASA binary format). The parse is sync, so it runs in a `worker_thread` and the Socket.IO event loop stays clear.

On-demand: command `run-job` `{ job: 'collect-game-data', serverId }` enqueues immediately (distinct job id from the scheduled `collect-game-data:{serverId}`).

Cancel: command `cancel-job` `{ job: 'collect-game-data', serverId }` removes waiting jobs and aborts a running parse via `worker_thread.terminate()`.

### Persistence

The agent does **not** talk to Mongo. After a successful parse it POSTs:

`POST {API_URL}/servers/:serverId/game-data`  
`Authorization: Bearer <machine access token>`  
Body: `{ game, collectedAt, players[], tribes[] }`

Circular `Tribe.Players` / `Player.Tribe` graphs from `@supremegaming/ark-files` are stripped before serialize. Snapshots are **not** sent on `command:progress` (ephemeral, 1MB Socket.IO limit). The socket is for job control and a short upload summary only. The API verifies the token's `agentId` owns that game server, then upserts Mongo.

### Commands

The API emits `command`; this process runs it and emits `command:progress`. Wiring is `attachCommandHandlers` in [`@supremegaming/agent/host`](../../libs/agent/host/README.md).

Lifecycle: `accepted` → `running` (optional percent) → `succeeded` | `failed` | `rejected`.

| `type` | What it does |
| --- | --- |
| `list-directory` | List a directory (names, types, sizes, mtimes — not file contents) |
| `run-job` | Enqueue a job immediately. First job: `collect-game-data` |
| `cancel-job` | Cancel waiting / running `collect-game-data` for a `serverId` |

Optional env `AGENT_FS_ROOT`: if set, listings outside that directory are rejected.

To add work such as start/stop/restart, register another handler on the dispatcher — same envelope, no new socket:

```ts
dispatcher.register('start-game-server', handler);
```

Shared types live in [`@supremegaming/agent/core`](../../libs/agent/core/README.md). Dispatcher and host runtime (jobs, command handlers, heartbeat, credentials) live in [`@supremegaming/agent/host`](../../libs/agent/host/README.md). This app is the process shell: env, Redis, Socket.IO connect. HTTP/SSE for the UI live in [`@supremegaming/api/v2`](../../libs/api/v2/README.md).

### Environment

See `.env.sample`. Required: `AGENT_ID`, `API_URL`. First boot also needs `REGISTRATION_TOKEN`. Redis (`REDIS_HOST` / `REDIS_PORT`) is for the local heartbeat scheduler **and** game-data jobs. `GAME_DATA_INTERVAL_MS` (default `300000`) sets the scheduled collect interval.

## Agent registration mechanism

This agent will be published as either a docker container image or a binary executable hosted on GitHub as a release.

The UI will provide an installation script that either pulls the container image and runs with defaults + a generated registration token, or downloads the binary and runs the same way.

On registration, the agent sends:

- System information (CPU, RAM, Disk, Network)
- Hostname
- IP address

## Game server management

The control plane sends game-server configuration over the `configuration` event (not the command channel). Fields include:

- Game server type (`ark-ascended` first; others later)
- Public IP (inherited from host or custom)
- Port configuration (game, query, rcon, etc.)
- Server name (optionally auto-discovered from game ini)
- RCON password (optionally auto-discovered from game ini)
- Game server save files directory (`server_directory`; absolute path to `SavedArks` or an alt save folder)
- Whether game data should be parsed and uploaded (`shouldProcess`)
