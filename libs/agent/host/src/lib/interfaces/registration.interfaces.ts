export interface CpuInfo {
  model: string;
  cores: number;
  speedMhz: number;
}

export interface MemoryInfo {
  totalBytes: number;
  freeBytes: number;
}

export interface DiskInfo {
  path: string;
  totalBytes: number;
  freeBytes: number;
  availableBytes: number;
}

export interface NetworkAddress {
  address: string;
  family: 'IPv4' | 'IPv6';
  internal: boolean;
  mac: string;
}

export interface NetworkInterfaceInfo {
  name: string;
  addresses: NetworkAddress[];
}

export interface NetworkInfo {
  interfaces: NetworkInterfaceInfo[];
  publicIp: string | null;
}

export interface OsInfo {
  platform: string;
  release: string;
  arch: string;
}

export interface SystemInfo {
  cpu: CpuInfo;
  memory: MemoryInfo;
  disks: DiskInfo[];
  network: NetworkInfo;
  hostname: string;
  os: OsInfo;
}

export interface RegistrationPayload {
  key: string;
  hostname: string;
  system: SystemInfo;
  timestamp: string;
}
