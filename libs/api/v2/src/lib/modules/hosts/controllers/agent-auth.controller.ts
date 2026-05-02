import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { Permission } from '../../auth/enum/permissions.enum';
import { JwtGuard } from '../../auth/guards/jwt/jwt.guard';
import { PermissionsGuard } from '../../auth/guards/permissions/permissions.guard';
import { AgentAuthService } from '../services/agent-auth.service';

@Controller()
export class AgentAuthController {
  constructor(private readonly agentAuthService: AgentAuthService) {}

  /**
   * Admin creates a one-time registration token for an agent.
   */
  @Post('admin/agents')
  @RequirePermissions(Permission.AgentManage)
  @UseGuards(JwtGuard, PermissionsGuard)
  async createRegistrationToken(@Body() body: { agentId: string; labels?: Record<string, string> }, @Req() req: any) {
    const userId = req.user?.user?.steamid || req.user?.sub || 'unknown';
    return this.agentAuthService.createRegistrationToken(body.agentId, userId);
  }

  /**
   * Agent exchanges a one-time registration token for access + refresh tokens.
   */
  @Post('agents/register')
  async register(@Body() body: { registrationToken: string; agentId: string }) {
    return this.agentAuthService.register(body.registrationToken, body.agentId);
  }

  /**
   * Agent rotates its refresh token for a new access + refresh token pair.
   */
  @Post('agents/token/refresh')
  async refreshTokens(@Body() body: { refreshToken: string; agentId: string }) {
    return this.agentAuthService.refreshTokens(body.refreshToken, body.agentId);
  }
}
