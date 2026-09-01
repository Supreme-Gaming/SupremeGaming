import * as os from 'os';
import { getLocalNetworkInterfaces, getPublicIp, getNetworkInfo } from './network-info';

jest.mock('public-ip', () => ({
  publicIpv4: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { publicIpv4 } = require('public-ip');

describe('network-info', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLocalNetworkInterfaces', () => {
    it('should map os network interfaces to typed result', () => {
      jest.spyOn(os, 'networkInterfaces').mockReturnValue({
        eth0: [
          {
            address: '192.168.1.100',
            netmask: '255.255.255.0',
            family: 'IPv4',
            mac: 'aa:bb:cc:dd:ee:ff',
            internal: false,
            cidr: '192.168.1.100/24',
          },
        ],
        lo: [
          {
            address: '127.0.0.1',
            netmask: '255.0.0.0',
            family: 'IPv4',
            mac: '00:00:00:00:00:00',
            internal: true,
            cidr: '127.0.0.1/8',
          },
        ],
      });

      const result = getLocalNetworkInterfaces();

      expect(result).toEqual([
        {
          name: 'eth0',
          addresses: [
            {
              address: '192.168.1.100',
              family: 'IPv4',
              internal: false,
              mac: 'aa:bb:cc:dd:ee:ff',
            },
          ],
        },
        {
          name: 'lo',
          addresses: [
            {
              address: '127.0.0.1',
              family: 'IPv4',
              internal: true,
              mac: '00:00:00:00:00:00',
            },
          ],
        },
      ]);
    });

    it('should handle empty interfaces', () => {
      jest.spyOn(os, 'networkInterfaces').mockReturnValue({});

      const result = getLocalNetworkInterfaces();

      expect(result).toEqual([]);
    });
  });

  describe('getPublicIp', () => {
    it('should return the public IPv4 address', async () => {
      publicIpv4.mockResolvedValue('203.0.113.50');

      const result = await getPublicIp();

      expect(result).toBe('203.0.113.50');
      expect(publicIpv4).toHaveBeenCalledWith({ timeout: 5000 });
    });

    it('should return null on failure', async () => {
      publicIpv4.mockRejectedValue(new Error('Network unreachable'));

      const result = await getPublicIp();

      expect(result).toBeNull();
    });

    it('should pass custom timeout', async () => {
      publicIpv4.mockResolvedValue('203.0.113.50');

      await getPublicIp(10000);

      expect(publicIpv4).toHaveBeenCalledWith({ timeout: 10000 });
    });
  });

  describe('getNetworkInfo', () => {
    it('should combine local interfaces and public IP', async () => {
      jest.spyOn(os, 'networkInterfaces').mockReturnValue({
        eth0: [
          {
            address: '10.0.0.5',
            netmask: '255.255.255.0',
            family: 'IPv4',
            mac: 'aa:bb:cc:dd:ee:ff',
            internal: false,
            cidr: '10.0.0.5/24',
          },
        ],
      });
      publicIpv4.mockResolvedValue('203.0.113.50');

      const result = await getNetworkInfo();

      expect(result.interfaces).toHaveLength(1);
      expect(result.interfaces[0].name).toBe('eth0');
      expect(result.publicIp).toBe('203.0.113.50');
    });

    it('should handle null public IP gracefully', async () => {
      jest.spyOn(os, 'networkInterfaces').mockReturnValue({});
      publicIpv4.mockRejectedValue(new Error('timeout'));

      const result = await getNetworkInfo();

      expect(result.interfaces).toEqual([]);
      expect(result.publicIp).toBeNull();
    });
  });
});
