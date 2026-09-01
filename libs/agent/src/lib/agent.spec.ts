import { buildRegistrationPayload } from './agent';
import * as systemInfo from './services/system-info';
import * as diskInfo from './services/disk-info';
import * as networkInfo from './services/network-info';

jest.mock('public-ip', () => ({
  publicIpv4: jest.fn(),
}));

describe('buildRegistrationPayload', () => {
  beforeEach(() => {
    jest.spyOn(systemInfo, 'getHostname').mockReturnValue('test-host');
    jest.spyOn(systemInfo, 'getCpuInfo').mockReturnValue({
      model: 'Test CPU',
      cores: 4,
      speedMhz: 2400,
    });
    jest.spyOn(systemInfo, 'getMemoryInfo').mockReturnValue({
      totalBytes: 8589934592,
      freeBytes: 4294967296,
    });
    jest.spyOn(systemInfo, 'getOsInfo').mockReturnValue({
      platform: 'linux',
      release: '5.15.0',
      arch: 'x64',
    });
    jest.spyOn(diskInfo, 'getDiskInfo').mockResolvedValue([
      {
        path: '/',
        totalBytes: 107374182400,
        freeBytes: 53687091200,
        availableBytes: 48318382080,
      },
    ]);
    jest.spyOn(networkInfo, 'getNetworkInfo').mockResolvedValue({
      interfaces: [
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
      ],
      publicIp: '203.0.113.50',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should build a complete registration payload', async () => {
    const payload = await buildRegistrationPayload('test-key-123');

    expect(payload.key).toBe('test-key-123');
    expect(payload.hostname).toBe('test-host');
    expect(payload.system.cpu.model).toBe('Test CPU');
    expect(payload.system.cpu.cores).toBe(4);
    expect(payload.system.memory.totalBytes).toBe(8589934592);
    expect(payload.system.disks).toHaveLength(1);
    expect(payload.system.disks[0].path).toBe('/');
    expect(payload.system.network.publicIp).toBe('203.0.113.50');
    expect(payload.system.network.interfaces).toHaveLength(1);
    expect(payload.system.os.platform).toBe('linux');
    expect(payload.system.hostname).toBe('test-host');
  });

  it('should include an ISO 8601 timestamp', async () => {
    const payload = await buildRegistrationPayload('key');

    expect(payload.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
  });

  it('should pass the provided key through', async () => {
    const payload = await buildRegistrationPayload('my-auth-token');

    expect(payload.key).toBe('my-auth-token');
  });
});
