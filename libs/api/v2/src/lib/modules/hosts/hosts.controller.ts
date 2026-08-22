import { Body, Controller, Get, HttpCode, MessageEvent, Param, Post, Query, Sse, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';

import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enum/permissions.enum';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { ResponseDto } from '../../decorators/response-dto.decorator';
import { AgentCommandsService } from './agent-commands.service';
import { CreateHostServerDto } from './dto/create-host-server.dto';
import { HostServerResponseDto } from './dto/host-server-response.dto';
import { IssueAgentCommandDto } from './dto/issue-agent-command.dto';
import { HostsService } from './hosts.service';

@Controller('hosts')
export class HostsController {
  constructor(private service: HostsService, private readonly commands: AgentCommandsService) {}

  @Get()
  @ResponseDto(HostServerResponseDto)
  // @RequirePermissions(Permission.ServerCreate)
  // @UseGuards(JwtGuard, PermissionsGuard)
  public getHostServers() {
    return this.service.getHostServers();
  }

  @Post()
  @ResponseDto(HostServerResponseDto)
  // @RequirePermissions(Permission.ServerCreate)
  // @UseGuards(JwtGuard, PermissionsGuard)
  public createHostServer(@Body() payload: CreateHostServerDto) {
    return this.service.createHostServer(payload);
  }

  @Sse(':agentId/commands/:requestId/events')
  // @RequirePermissions(Permission.Commands)
  // @UseGuards(JwtGuard, PermissionsGuard)
  public streamCommand(
    @Param('agentId') agentId: string,
    @Param('requestId') requestId: string
  ): Observable<MessageEvent> {
    return this.commands.observe(agentId, requestId);
  }

  @Get(':agentId/commands/:requestId')
  // @RequirePermissions(Permission.Commands)
  // @UseGuards(JwtGuard, PermissionsGuard)
  public getCommand(@Param('agentId') agentId: string, @Param('requestId') requestId: string) {
    return this.commands.getCommand(agentId, requestId);
  }

  @Post(':agentId/commands')
  @HttpCode(202)
  // @RequirePermissions(Permission.Commands)
  // @UseGuards(JwtGuard, PermissionsGuard)
  public issueCommand(
    @Param('agentId') agentId: string,
    @Body() body: IssueAgentCommandDto,
    @Query('wait') wait?: string,
    @Query('timeoutMs') timeoutMs?: string
  ) {
    const parsedTimeout = timeoutMs ? Number.parseInt(timeoutMs, 10) : undefined;
    return this.commands.issue(agentId, body, {
      wait: wait === 'true' || wait === '1',
      timeoutMs: Number.isFinite(parsedTimeout) ? parsedTimeout : undefined,
    });
  }
}
