export interface SupremeGamingEnvironment {
  production: boolean;
  servers: Array<GameServer>;
  apiUrl: string;
}

export interface GameServer {
  host: string;
  port: number;
  rcon_port: number;
  map_name: string;
  game: 'ark' | 'conan' | 'atlas';
}
