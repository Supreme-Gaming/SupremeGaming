import * as os from 'os';
import { getCpuInfo, getMemoryInfo, getOsInfo, getHostname } from './system-info';

describe('system-info', () => {
  describe('getCpuInfo', () => {
    it('should return cpu model, cores, and speed', () => {
      jest.spyOn(os, 'cpus').mockReturnValue([
        {
          model: 'Intel(R) Core(TM) i7-9700K',
          speed: 3600,
          times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 },
        },
        {
          model: 'Intel(R) Core(TM) i7-9700K',
          speed: 3600,
          times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 },
        },
      ]);

      const result = getCpuInfo();

      expect(result).toEqual({
        model: 'Intel(R) Core(TM) i7-9700K',
        cores: 2,
        speedMhz: 3600,
      });
    });

    it('should handle empty cpu list', () => {
      jest.spyOn(os, 'cpus').mockReturnValue([]);

      const result = getCpuInfo();

      expect(result).toEqual({
        model: 'unknown',
        cores: 0,
        speedMhz: 0,
      });
    });
  });

  describe('getMemoryInfo', () => {
    it('should return total and free memory', () => {
      jest.spyOn(os, 'totalmem').mockReturnValue(17179869184);
      jest.spyOn(os, 'freemem').mockReturnValue(8589934592);

      const result = getMemoryInfo();

      expect(result).toEqual({
        totalBytes: 17179869184,
        freeBytes: 8589934592,
      });
    });
  });

  describe('getOsInfo', () => {
    it('should return platform, release, and arch', () => {
      jest.spyOn(os, 'platform').mockReturnValue('linux');
      jest.spyOn(os, 'release').mockReturnValue('5.15.0-generic');
      jest.spyOn(os, 'arch').mockReturnValue('x64');

      const result = getOsInfo();

      expect(result).toEqual({
        platform: 'linux',
        release: '5.15.0-generic',
        arch: 'x64',
      });
    });
  });

  describe('getHostname', () => {
    it('should return the hostname', () => {
      jest.spyOn(os, 'hostname').mockReturnValue('game-server-01');

      const result = getHostname();

      expect(result).toBe('game-server-01');
    });
  });
});
