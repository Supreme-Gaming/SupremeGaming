import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RegistrationToken, RegistrationTokenSchema } from './schemas/registration-token.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { MachineJwtGuard } from './guards/machine-jwt.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RegistrationToken.name, schema: RegistrationTokenSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [AgentsController],
  providers: [AgentsService, MachineJwtGuard],
  exports: [AgentsService, MachineJwtGuard],
})
export class AgentsModule {}
