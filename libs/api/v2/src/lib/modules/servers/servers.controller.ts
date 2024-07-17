import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { GameServer } from '@supremegaming/common/entities/servers';

import { ServersService } from './servers.service';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { Permission } from '../auth/enum/permissions.enum';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

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

  @RequirePermissions(Permission.Commands)
  @UseGuards(JwtGuard, PermissionsGuard)
  @Post('command')
  public async executeCommand(@Body() payload: Partial<GameServer> & { command: string }) {
    const props = JSON.parse(JSON.stringify(payload));
    delete props.command;

    const server = await this.service.getServerByProps(props, true);

    return this.service.executeServerCommand(server, payload.command);
  }

  @Post()
  @RequirePermissions(Permission.ServerCreate)
  @UseGuards(JwtGuard, PermissionsGuard)
  public createGameServer(@Body() payload: Partial<GameServer>) {
    return this.service.createGameServer(payload);
  }
}
