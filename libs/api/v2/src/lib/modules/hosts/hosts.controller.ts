import { Host } from '@angular/core';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enum/permissions.enum';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { PermissionsGuard } from '../auth/guards/permissions/permissions.guard';
import { HostsService } from './hosts.service';

@Controller('hosts')
export class HostsController {
  constructor(private service: HostsService) {}

  @Get()
  @RequirePermissions(Permission.ServerCreate)
  @UseGuards(JwtGuard, PermissionsGuard)
  public getHostServers() {
    return this.service.getHostServers();
  }

  @Post()
  @RequirePermissions(Permission.ServerCreate)
  @UseGuards(JwtGuard, PermissionsGuard)
  public createHostServer(@Body() payload: Partial<Host>) {
    return this.service.createHostServer(payload);
  }
}
