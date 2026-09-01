import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { AgentsService } from '../agents.service';
import { MACHINE_AGENT_REQUEST_KEY, MachineJwtGuard } from './machine-jwt.guard';

describe('MachineJwtGuard', () => {
  const agentsService = {
    verifyAccessToken: jest.fn(),
  };
  const guard = new MachineJwtGuard(agentsService as unknown as AgentsService);

  const createContext = (authorization?: string) => {
    const request: { headers: { authorization?: string }; agent?: unknown } = {
      headers: { authorization },
    };
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      request,
    } as ExecutionContext & { request: typeof request };
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('rejects a missing Bearer token', () => {
    expect(() => guard.canActivate(createContext())).toThrow(UnauthorizedException);
    expect(agentsService.verifyAccessToken).not.toHaveBeenCalled();
  });

  it('attaches the verified agent payload to the request', () => {
    const payload = { agentId: 'agent-1', type: 'access', roles: ['worker'] };
    agentsService.verifyAccessToken.mockReturnValue(payload);
    const context = createContext('Bearer machine-token');

    expect(guard.canActivate(context)).toBe(true);
    expect(agentsService.verifyAccessToken).toHaveBeenCalledWith('machine-token');
    expect(context.request[MACHINE_AGENT_REQUEST_KEY]).toEqual(payload);
  });
});
