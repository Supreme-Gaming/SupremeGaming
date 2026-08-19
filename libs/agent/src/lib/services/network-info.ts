import * as os from 'os';
import { Resolver } from 'dns/promises';
import { NetworkInfo, NetworkInterfaceInfo } from '../interfaces/registration.interfaces';

const OPENDNS_RESOLVERS = ['208.67.222.222', '208.67.220.220'];
const OPENDNS_MYIP_HOST = 'myip.opendns.com';

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

async function lookupPublicIpv4(timeoutMs = 5000): Promise<string> {
  const resolver = new Resolver();
  resolver.setServers(OPENDNS_RESOLVERS);

  let timer: NodeJS.Timeout | undefined;
  try {
    const addresses = await Promise.race([
      resolver.resolve4(OPENDNS_MYIP_HOST),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Public IP lookup timed out')), timeoutMs);
      }),
    ]);
    const address = addresses[0];
    if (!address) {
      throw new Error('Public IP lookup returned no address');
    }
    return address;
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

export async function getPublicIp(timeoutMs = 5000): Promise<string | null> {
  try {
    return await lookupPublicIpv4(timeoutMs);
  } catch {
    return null;
  }
}

export async function getNetworkInfo(): Promise<NetworkInfo> {
  const [interfaces, pubIp] = await Promise.all([Promise.resolve(getLocalNetworkInterfaces()), getPublicIp()]);

  return { interfaces, publicIp: pubIp };
}
