import { Injectable, Logger, ForbiddenException, GoneException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sign, verify } from 'jsonwebtoken';
import { randomUUID, randomBytes, createHash } from 'crypto';

import { machineAuthConfig } from '../../config/machine-auth.config';
import { RegistrationToken, RegistrationTokenDocument } from './schemas/registration-token.schema';
import { RefreshToken, RefreshTokenDocument } from './schemas/refresh-token.schema';

interface AccessTokenPayload {
  agentId: string;
  type: 'access';
  roles: string[];
}

interface RegistrationTokenPayload {
  agentId: string;
  type: 'registration';
  createdBy: string;
  jti: string;
}

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);

  constructor(
    @InjectModel(RegistrationToken.name) private readonly registrationTokenModel: Model<RegistrationTokenDocument>,
    @InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshTokenDocument>
  ) {}

  async createRegistrationToken(
    agentId: string,
    userId: string
  ): Promise<{ registrationToken: string; installScript: string }> {
    const jti = randomUUID();

    const registrationToken = sign(
      { agentId, type: 'registration', createdBy: userId, jti } as RegistrationTokenPayload,
      machineAuthConfig.machineJwtSecret,
      { expiresIn: machineAuthConfig.registrationTokenTtl }
    );

    await new this.registrationTokenModel({ jti, agentId, createdBy: userId }).save();

    const installScript = [
      `#!/bin/bash`,
      `export CP_URL="\${CP_URL:-https://your-control-plane.example.com}"`,
      `export AGENT_ID="${agentId}"`,
      `export REGISTRATION_TOKEN="${registrationToken}"`,
      `# Start the agent — it will register automatically on first boot`,
    ].join('\n');

    this.logger.log(`Registration token created for agent ${agentId} by user ${userId}`);
    return { registrationToken, installScript };
  }

  async register(
    registrationToken: string,
    agentId: string
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    let payload: RegistrationTokenPayload;
    try {
      payload = verify(registrationToken, machineAuthConfig.machineJwtSecret) as RegistrationTokenPayload;
    } catch {
      throw new GoneException('Registration token is invalid or expired');
    }

    if (payload.type !== 'registration') {
      throw new ForbiddenException('Invalid token type');
    }

    if (payload.agentId !== agentId) {
      throw new ForbiddenException('Agent ID mismatch');
    }

    const record = await this.registrationTokenModel.findOne({ jti: payload.jti }).exec();
    if (!record || record.used) {
      throw new GoneException('Registration token has already been used');
    }

    record.used = true;
    await record.save();

    const { accessToken, expiresIn } = this.issueAccessToken(agentId);
    const refreshToken = await this.issueRefreshToken(agentId, payload.createdBy);

    this.logger.log(`Agent ${agentId} registered successfully`);
    return { accessToken, refreshToken, expiresIn };
  }

  async refreshTokens(
    refreshToken: string,
    agentId: string
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number } | { error: string; action: string }> {
    const hash = this.hashToken(refreshToken);
    const record = await this.refreshTokenModel.findOne({ tokenHash: hash }).exec();

    if (!record || record.agentId !== agentId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (record.revoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (record.expiresAt < new Date()) {
      return { error: 'refresh_token_expired', action: 're-register' };
    }

    record.revoked = true;
    await record.save();

    const { accessToken, expiresIn } = this.issueAccessToken(agentId);
    const newRefreshToken = await this.issueRefreshToken(agentId, record.createdBy);

    this.logger.log(`Tokens refreshed for agent ${agentId}`);
    return { accessToken, refreshToken: newRefreshToken, expiresIn };
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      const payload = verify(token, machineAuthConfig.machineJwtSecret) as AccessTokenPayload;
      if (payload.type !== 'access') {
        throw new Error('Invalid token type');
      }
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private issueAccessToken(agentId: string): { accessToken: string; expiresIn: number } {
    const accessToken = sign(
      { agentId, type: 'access', roles: ['worker'] } as AccessTokenPayload,
      machineAuthConfig.machineJwtSecret,
      { expiresIn: machineAuthConfig.accessTokenTtl }
    );

    const ttlStr = machineAuthConfig.accessTokenTtl;
    const match = ttlStr.match(/^(\d+)(m|h|s)$/);
    let expiresIn = 900;
    if (match) {
      const val = parseInt(match[1], 10);
      const unit = match[2];
      if (unit === 's') expiresIn = val;
      else if (unit === 'm') expiresIn = val * 60;
      else if (unit === 'h') expiresIn = val * 3600;
    }

    return { accessToken, expiresIn };
  }

  private async issueRefreshToken(agentId: string, createdBy: string): Promise<string> {
    const rawToken = randomBytes(48).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + machineAuthConfig.refreshTokenTtlMs);

    await new this.refreshTokenModel({ tokenHash, agentId, expiresAt, createdBy }).save();

    return rawToken;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
