# agent

Shared types for host agents (`@supremegaming/agent/core`). Host-process runtime lives in [`@supremegaming/agent/host`](../host).

The control plane never talks to agents over public HTTP for real-time work. This library is the Socket.IO command contract both sides share. BullMQ jobs, command handlers, heartbeat, and credentials are in the host library.

## Command protocol

Socket.IO events (namespace `/hosts`, defined as `AGENT_SOCKET_EVENTS`):

| Event | Direction | Purpose |
| --- | --- | --- |
| `command` | control plane → agent | Start a unit of work |
| `command:progress` | agent → control plane | Ack, percent, result, or error |

Envelope (`AgentCommand`):

```ts
{
  requestId: string;
  type: string;       // e.g. 'list-directory'
  payload: unknown;
  issuedAt: string;   // ISO-8601
}
```

Progress (`AgentCommandProgress`) uses status `queued → accepted → running → succeeded | failed | rejected`. While `running`, `progress` may be 0–100. Terminal events carry `data` or `error: { code, message }`.

### Built-in command types (`AGENT_COMMAND_TYPES`)

| Type | Payload | Result |
| --- | --- | --- |
| `list-directory` | `{ path: string }` | `{ path, truncated, entries[] }` |
| `run-job` | `{ job: 'collect-game-data', serverId }` | `{ serverId, game, playerCount, tribeCount, collectedAt }` |
| `cancel-job` | `{ job: 'collect-game-data', serverId }` | `{ serverId, cancelled: true }` |

`list-directory` never reads file contents. If `AGENT_FS_ROOT` is set on the agent, paths outside that root are rejected (`path_forbidden`). Handler: `listDirectoryHandler` in `@supremegaming/agent/host`.

`run-job` / `cancel-job` control local BullMQ work on the agent. Handlers are `runJobHandler(jobManager)` / `cancelJobHandler(jobManager)` in `@supremegaming/agent/host`. Game-data snapshots are POSTed to the API over HTTP — they are not sent on `command:progress` (Socket.IO is for job control and a short upload summary only).

Game type string for ARK: Survival Ascended is `ark-ascended` (`AGENT_GAME_TYPES.ARK_ASCENDED`). Host configuration (`configuration` event) carries `AgentGameServerConfig[]` (`_id`, ports, `game`, `shouldProcess`, `server_directory`, …).

## Dispatcher

`AgentCommandDispatcher` (in `@supremegaming/agent/host`) maps `type` → handler. Register new work the same way:

```ts
dispatcher.register('start-game-server', async (command, report) => {
  report({ status: 'running', progress: 10, message: 'Starting' });
  // ...
  report({ status: 'succeeded', data: { pid } });
});
```

Unknown types are `rejected` with `unknown_command`. Thrown `AgentCommandError` values become `failed` with that `code`.

## Tests

```bash
nx test agent-core
nx test agent-host
```
