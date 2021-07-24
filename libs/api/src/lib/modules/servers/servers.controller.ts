import { Controller, Get, Param } from '@nestjs/common';

import { ServersService } from './servers.service';

@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Get()
  public getServers() {
    return this.serversService.getAllServers();
  }

  @Get(':port')
  public getServerByPort(@Param() params: { port: number }) {
    return this.serversService.getServerByPort(params.port);
  }
}
