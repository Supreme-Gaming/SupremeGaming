# agent

Shared types and runtime helpers for host agents (`@supremegaming/agent`).

The control plane never talks to agents over public HTTP for real-time work. This library is the contract both sides share: registration payloads, the Socket.IO command envelope, and the dispatcher the agent process uses to run those commands.

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

`list-directory` never reads file contents. If `AGENT_FS_ROOT` is set on the agent, paths outside that root are rejected (`path_forbidden`).

## Dispatcher

`AgentCommandDispatcher` maps `type` → handler. Register new work the same way:

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
nx test agent
```
