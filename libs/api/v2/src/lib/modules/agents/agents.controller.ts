import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';

import { machineAuthConfig } from '../../config/machine-auth.config';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enum/permissions.enum';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { AgentsService } from './agents.service';

const registrationTokenGuards = machineAuthConfig.devOpenRegistration ? [] : [JwtGuard, PermissionsGuard];

@Controller('agents')
export class AgentsController {
  private readonly logger = new Logger(AgentsController.name);

  constructor(private readonly agentsService: AgentsService) {
    if (machineAuthConfig.devOpenRegistration) {
      this.logger.warn('DEV_OPEN_REGISTRATION=true — POST /agents/registration-tokens is unauthenticated');
    }
  }

  @Post('registration-tokens')
  @RequirePermissions(Permission.AgentManage)
  @UseGuards(...registrationTokenGuards)
  async createRegistrationToken(@Body() body: { agentId: string; labels?: Record<string, string> }, @Req() req: any) {
    const userId = req.user?.user?.steamid || req.user?.sub || 'unknown';
    return this.agentsService.createRegistrationToken(body.agentId, userId);
  }

  @Post('register')
  async register(@Body() body: { registrationToken: string; agentId: string }) {
    return this.agentsService.register(body.registrationToken, body.agentId);
  }

  @Post('token/refresh')
  async refreshTokens(@Body() body: { refreshToken: string; agentId: string }) {
    return this.agentsService.refreshTokens(body.refreshToken, body.agentId);
  }
}
