import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async login(user) {
    const jwt = { username: user.displayName, sub: user.id, steam: user._json, user: user.user };
    const access_token = this.jwtService.sign(jwt);
    const decoded = this.jwtService.decode(access_token) as {
      [key: string]: string | number;
    };

    return {
      access_token: this.jwtService.sign(jwt),
      exp: decoded.exp,
    };
  }
}
