import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { Server } from '@supremegaming/common/entities/servers';

import { ServersService } from './servers.service';

@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Get(':port')
  public getServerByPort(@Param() params: { port: number }) {
    return this.serversService.getServerByProps({
      port: params.port,
    });
  }

  @Get()
  public getServers() {
    return this.serversService.getAllServers();
  }

  @Post()
  public createServer(@Body() payload: Partial<Server>) {
    return this.serversService.createServer(payload);
  }
}
