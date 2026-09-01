import { Socket } from 'socket.io-client';

import { AGENT_COMMAND_TYPES, AGENT_SOCKET_EVENTS, type AgentCommand } from '@supremegaming/agent/core';

import { AgentCommandDispatcher } from '../commands/dispatcher';
import { cancelJobHandler } from '../commands/handlers/cancel-job';
import { listDirectoryHandler } from '../commands/handlers/list-directory';
import { runJobHandler } from '../commands/handlers/run-job';
import { JobManager } from '../jobs/manager';

export function attachCommandHandlers(socket: Socket, jobManager: JobManager): AgentCommandDispatcher {
  const dispatcher = new AgentCommandDispatcher();
  dispatcher.register(AGENT_COMMAND_TYPES.LIST_DIRECTORY, listDirectoryHandler);
  dispatcher.register(AGENT_COMMAND_TYPES.RUN_JOB, runJobHandler(jobManager));
  dispatcher.register(AGENT_COMMAND_TYPES.CANCEL_JOB, cancelJobHandler(jobManager));

  jobManager.setProgressEmitter((progress) => {
    socket.emit(AGENT_SOCKET_EVENTS.COMMAND_PROGRESS, progress);
  });

  socket.on(AGENT_SOCKET_EVENTS.COMMAND, (command: AgentCommand) => {
    void dispatcher
      .execute(command, (progress) => {
        socket.emit(AGENT_SOCKET_EVENTS.COMMAND_PROGRESS, progress);
      })
      .catch((err) => {
        console.error('[agent] Command dispatcher failed:', err);
      });
  });

  return dispatcher;
}
