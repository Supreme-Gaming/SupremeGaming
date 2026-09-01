import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AgentsService } from '../agents.service';

export const MACHINE_AGENT_REQUEST_KEY = 'agent';

export interface MachineAccessTokenPayload {
  agentId: string;
  type: 'access';
  roles: string[];
}

@Injectable()
export class MachineJwtGuard implements CanActivate {
  constructor(private readonly agentsService: AgentsService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const header = request.headers?.authorization;

    if (typeof header !== 'string' || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid access token');
    }

    const token = header.slice('Bearer '.length).trim();
    if (!token) {
      throw new UnauthorizedException('Invalid access token');
    }

    const payload = this.agentsService.verifyAccessToken(token);
    request[MACHINE_AGENT_REQUEST_KEY] = payload;
    return true;
  }
}
