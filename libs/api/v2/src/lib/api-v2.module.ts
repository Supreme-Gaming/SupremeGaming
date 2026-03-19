import { Module } from '@nestjs/common';

import { HostsModule } from './modules/hosts/hosts.module';
import { ServersModule } from './modules/servers/servers.module';

@Module({
  imports: [HostsModule, ServersModule],
})
export class ApiV2Module {}
