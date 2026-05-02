import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HostServer, HostServerSchema } from './schemas/host-server.schema';
import { RegistrationToken, RegistrationTokenSchema } from './schemas/registration-token.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { HostsController } from './hosts.controller';
import { AgentAuthController } from './controllers/agent-auth.controller';
import { HostsGateway } from './hosts.gateway';
import { HostsService } from './hosts.service';
import { AgentAuthService } from './services/agent-auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HostServer.name, schema: HostServerSchema },
      { name: RegistrationToken.name, schema: RegistrationTokenSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [HostsController, AgentAuthController],
  providers: [HostsService, AgentAuthService, HostsGateway],
  exports: [AgentAuthService],
})
export class HostsModule {}
