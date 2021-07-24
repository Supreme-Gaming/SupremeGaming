import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { Server } from '@supremegaming/common/entities/servers';

import { ServersService } from './servers.service';

@Controller('servers')
export class ServersController {
  constructor(private readonly service: ServersService) {}

  @Get(':port')
  public getServerByPort(@Param() params: { port: number }) {
    return this.service.getServerByProps({
      port: params.port,
    });
  }

  @Get()
  public getServers() {
    return this.service.getAllServers();
  }

  @Post('command')
  public async executeCommand(@Body() payload: Partial<Server> & { command: string }) {
    const props = JSON.parse(JSON.stringify(payload));
    delete props.command;

    const server = await this.service.getServerByProps(props, true);

    return this.service.executeServerCommand(server, payload.command);
  }

  @Post()
  public createServer(@Body() payload: Partial<Server>) {
    return this.service.createServer(payload);
  }
}
