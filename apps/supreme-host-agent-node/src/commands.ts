import { Socket } from 'socket.io-client';
import {
  AGENT_COMMAND_TYPES,
  AGENT_SOCKET_EVENTS,
  type AgentCommand,
  AgentCommandDispatcher,
  listDirectoryHandler,
} from '@supremegaming/agent';

export function attachCommandHandlers(socket: Socket): AgentCommandDispatcher {
  const dispatcher = new AgentCommandDispatcher();
  dispatcher.register(AGENT_COMMAND_TYPES.LIST_DIRECTORY, listDirectoryHandler);

  socket.on(AGENT_SOCKET_EVENTS.COMMAND, (command: AgentCommand) => {
    void dispatcher.execute(command, (progress) => {
      socket.emit(AGENT_SOCKET_EVENTS.COMMAND_PROGRESS, progress);
    }).catch((err) => {
      console.error('[agent] Command dispatcher failed:', err);
    });
  });

  return dispatcher;
}
