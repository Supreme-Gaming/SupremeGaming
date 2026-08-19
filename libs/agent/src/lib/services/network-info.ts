import * as os from 'os';
// @ts-ignore public-ip is ESM-only with no top-level "types"; node10 moduleResolution cannot see package exports
import { publicIpv4 } from 'public-ip';
import { NetworkInfo, NetworkInterfaceInfo } from '../interfaces/registration.interfaces';

export function getLocalNetworkInterfaces(): NetworkInterfaceInfo[] {
  const interfaces = os.networkInterfaces();

  return Object.entries(interfaces)
    .filter(([, addrs]) => addrs !== undefined)
    .map(([name, addrs]) => ({
      name,
      addresses: addrs.map((addr) => ({
        address: addr.address,
        family: addr.family as 'IPv4' | 'IPv6',
        internal: addr.internal,
        mac: addr.mac,
      })),
    }));
}

export async function getPublicIp(timeoutMs = 5000): Promise<string | null> {
  try {
    return await publicIpv4({ timeout: timeoutMs });
  } catch {
    return null;
  }
}

export async function getNetworkInfo(): Promise<NetworkInfo> {
  const [interfaces, pubIp] = await Promise.all([Promise.resolve(getLocalNetworkInterfaces()), getPublicIp()]);

  return { interfaces, publicIp: pubIp };
}
