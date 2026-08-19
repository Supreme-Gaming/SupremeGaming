# api-v2

NestJS modules for the v2 control plane: hosts, agents (machine auth), servers, and (optional) user auth.

Host agents are not exposed on the public internet. The UI issues commands over REST/SSE on this API; this library pushes them to a connected agent on Socket.IO namespace `/hosts`.

## Host / agent command delivery

`HostsModule` owns both the public HTTP surface and the private agent socket.

```
UI --HTTP--> HostsController --emit "command"--> room agent:{agentId}
UI <--SSE--- AgentCommandsService <--"command:progress"-- agent
```

### REST (UI → API)

Base path is the app global prefix, usually `/api`.

| Method | Path | Behavior |
| --- | --- | --- |
| `POST` | `/hosts/:agentId/commands` | Dispatch a command. **202** with `{ requestId, agentId, type, result }`. Query `wait=true` holds until a terminal status (default 30s, override with `timeoutMs`). |
| `GET` | `/hosts/:agentId/commands/:requestId` | Latest progress snapshot |
| `GET` | `/hosts/:agentId/commands/:requestId/events` | SSE stream of progress (replays current snapshot, completes on terminal status) |

Body for `POST`:

```json
{ "type": "list-directory", "payload": { "path": "/home/steam" } }
```

If the agent id is unknown → **404**. If it is known but has no live socket → **503** `{ error: "agent_offline" }`. Commands are not queued while offline.

### Socket.IO (API → agent)

`HostsGateway` (`namespace: '/hosts'`):

- Handshake auth: `{ token, agentId }` (machine JWT). Connected sockets join room `agent:{agentId}`.
- Existing presence events: `register` / `registered`, `heartbeat` / `heartbeat-ack`.
- Command events (shared with `@supremegaming/agent`): `command` to the agent, `command:progress` back. Progress is attributed from `socket.data.agentId`, not from the payload, so one agent cannot complete another's request.

`AgentSocketBridge` holds the Socket.IO `Server` so REST code can `emit` without a circular gateway dependency. In-flight commands are tracked in memory on `AgentCommandsService` (cleared a few minutes after completion).

Shared types live in [`@supremegaming/agent`](../agent/README.md). Adding a new command is a new `type` string here plus a handler registration in the host agent.

## Running unit tests

Run `nx test api-v2` to execute the unit tests via [Jest](https://jestjs.io).
