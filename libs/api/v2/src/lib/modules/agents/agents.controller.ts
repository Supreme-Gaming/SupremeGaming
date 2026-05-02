import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enum/permissions.enum';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { AgentsService } from './agents.service';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post('registration-tokens')
  @RequirePermissions(Permission.AgentManage)
  @UseGuards(JwtGuard, PermissionsGuard)
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
