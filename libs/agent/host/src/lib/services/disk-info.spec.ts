import { statfs } from 'fs/promises';
import { getDiskInfo } from './disk-info';

jest.mock('fs/promises', () => ({
  statfs: jest.fn(),
}));

const mockStatfs = statfs as jest.MockedFunction<typeof statfs>;

describe('disk-info', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return disk info with calculated byte values', async () => {
    mockStatfs.mockResolvedValue({
      blocks: 1000,
      bsize: 4096,
      bfree: 500,
      bavail: 450,
    } as any);

    const result = await getDiskInfo(['/']);

    expect(result).toEqual([
      {
        path: '/',
        totalBytes: 4096000,
        freeBytes: 2048000,
        availableBytes: 1843200,
      },
    ]);
  });

  it('should handle multiple paths', async () => {
    mockStatfs
      .mockResolvedValueOnce({
        blocks: 1000,
        bsize: 4096,
        bfree: 500,
        bavail: 450,
      } as any)
      .mockResolvedValueOnce({
        blocks: 2000,
        bsize: 4096,
        bfree: 1000,
        bavail: 900,
      } as any);

    const result = await getDiskInfo(['/', '/data']);

    expect(result).toHaveLength(2);
    expect(result[0].path).toBe('/');
    expect(result[1].path).toBe('/data');
  });

  it('should skip paths that fail and warn', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    mockStatfs.mockRejectedValue(new Error('ENOENT'));

    const result = await getDiskInfo(['/nonexistent']);

    expect(result).toEqual([]);
    expect(warnSpy).toHaveBeenCalledWith('[agent] Failed to get disk info for /nonexistent:', expect.any(Error));

    warnSpy.mockRestore();
  });

  it('should continue processing after a failed path', async () => {
    jest.spyOn(console, 'warn').mockImplementation();
    mockStatfs.mockRejectedValueOnce(new Error('ENOENT')).mockResolvedValueOnce({
      blocks: 1000,
      bsize: 4096,
      bfree: 500,
      bavail: 450,
    } as any);

    const result = await getDiskInfo(['/bad', '/good']);

    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('/good');

    (console.warn as jest.Mock).mockRestore();
  });
});
