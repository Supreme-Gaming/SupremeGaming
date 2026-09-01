import { AGENT_JOB_TYPES, type AgentCommand, type RunJobPayload } from '@supremegaming/agent/core';

import { AgentCommandError } from '../errors';
import { AgentCommandHandler, AgentCommandReporter } from '../dispatcher';
import { JobManager } from '../../jobs/manager';

export function runJobHandler(jobManager: JobManager): AgentCommandHandler {
  return async (command: AgentCommand<RunJobPayload>, report: AgentCommandReporter) => {
    const payload = command.payload;

    if (!payload?.job || payload.job !== AGENT_JOB_TYPES.COLLECT_GAME_DATA) {
      throw new AgentCommandError('unknown_job', `Unknown job: ${payload?.job ?? '(missing)'}`);
    }

    if (!payload.serverId) {
      throw new AgentCommandError('invalid_payload', 'payload.serverId is required');
    }

    const result = await jobManager.runCollectGameData(payload.serverId, { requestId: command.requestId });
    
    report({ status: 'succeeded', data: result });
  };
}
