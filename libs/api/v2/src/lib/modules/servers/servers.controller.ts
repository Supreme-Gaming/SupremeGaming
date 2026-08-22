import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { ObjectIdParamsDto } from '@supremegaming/common/nest';

import { ResponseDto } from '../../decorators/response-dto.decorator';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { Permission } from '../auth/enum/permissions.enum';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CreateGameServerDto } from './dto/create-game-server.dto';
import { ExecuteServerCommandDto } from './dto/execute-server-command.dto';
import { GameServerResponseDto } from './dto/game-server-response.dto';
import { GetServerByPortParamsDto } from './dto/get-server-by-port-params.dto';
import { UpdateGameServerDto } from './dto/update-game-server.dto';
import { GameServer } from './schemas/game-server.schema';
import { ServersService } from './servers.service';

@Controller('servers')
export class ServersController {
  constructor(private readonly service: ServersService) {}

  @Get(':port')
  @ResponseDto(GameServerResponseDto)
  public getServerByPort(@Param() params: GetServerByPortParamsDto) {
    return this.service.getServerByProps({
      port: params.port,
    });
  }

  @Get()
  @ResponseDto(GameServerResponseDto)
  public getServers() {
    return this.service.getAllServers();
  }

  // @RequirePermissions(Permission.Commands)
  // @UseGuards(JwtGuard, PermissionsGuard)
  @Post('command')
  public async executeCommand(@Body() payload: ExecuteServerCommandDto) {
    const { command, ...rest } = payload;
    const props = Object.fromEntries(Object.entries(rest).filter(([, value]) => value !== undefined)) as Partial<GameServer>;
    const server = await this.service.getServerByProps(props);

    return this.service.executeServerCommand(server, command);
  }

  @Post()
  @ResponseDto(GameServerResponseDto)
  // @RequirePermissions(Permission.ServerCreate)
  // @UseGuards(JwtGuard, PermissionsGuard)
  public createGameServer(@Body() payload: CreateGameServerDto) {
    return this.service.createGameServer(payload);
  }

  @Patch(':id')
  @ResponseDto(GameServerResponseDto)
  // @RequirePermissions(Permission.ServerUpdate)
  // @UseGuards(JwtGuard, PermissionsGuard)
  public updateGameServer(@Param() params: ObjectIdParamsDto, @Body() payload: UpdateGameServerDto) {
    return this.service.updateGameServer(params.id, payload);
  }

  @Delete(':id')
  @HttpCode(204)
  // @RequirePermissions(Permission.ServerDelete)
  // @UseGuards(JwtGuard, PermissionsGuard)
  public deleteGameServer(@Param() params: ObjectIdParamsDto) {
    return this.service.deleteGameServer(params.id);
  }
}
