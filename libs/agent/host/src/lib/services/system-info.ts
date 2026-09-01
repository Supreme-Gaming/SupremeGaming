import * as os from 'os';
import { CpuInfo, MemoryInfo, OsInfo } from '../interfaces/registration.interfaces';

export function getCpuInfo(): CpuInfo {
  const cpus = os.cpus();
  return {
    model: cpus.length > 0 ? cpus[0].model : 'unknown',
    cores: cpus.length,
    speedMhz: cpus.length > 0 ? cpus[0].speed : 0,
  };
}

export function getMemoryInfo(): MemoryInfo {
  return {
    totalBytes: os.totalmem(),
    freeBytes: os.freemem(),
  };
}

export function getOsInfo(): OsInfo {
  return {
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
  };
}

export function getHostname(): string {
  return os.hostname();
}
