import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { JwtGuard } from './guards/jwt/jwt.guard';
import { SteamGuard } from './guards/steam/steam.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(SteamGuard)
  @Get('steam')
  public async loginSteam() {
    return;
  }

  @UseGuards(SteamGuard)
  @Get('steam/return')
  public async returnCallback(@Req() request) {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtGuard)
  @Get('steam/info')
  public async getInfo(@Req() req) {
    return req.user;
  }
}
