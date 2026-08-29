import { getCpuInfo, getMemoryInfo, getOsInfo, getHostname } from './services/system-info';
import { getDiskInfo } from './services/disk-info';
import { getNetworkInfo } from './services/network-info';
import { RegistrationPayload, SystemInfo } from './interfaces/registration.interfaces';

export async function buildRegistrationPayload(key: string): Promise<RegistrationPayload> {
  const hostname = getHostname();
  const cpu = getCpuInfo();
  const memory = getMemoryInfo();
  const osInfo = getOsInfo();

  const [disks, network] = await Promise.all([getDiskInfo(), getNetworkInfo()]);

  const system: SystemInfo = {
    cpu,
    memory,
    disks,
    network,
    hostname,
    os: osInfo,
  };

  return {
    key,
    hostname,
    system,
    timestamp: new Date().toISOString(),
  };
}
