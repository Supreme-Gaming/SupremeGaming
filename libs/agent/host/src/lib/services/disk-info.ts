import { statfs } from 'fs/promises';
import * as os from 'os';
import { DiskInfo } from '../interfaces/registration.interfaces';

function getDefaultPaths(): string[] {
  return os.platform() === 'win32' ? ['C:\\'] : ['/'];
}

export async function getDiskInfo(paths: string[] = getDefaultPaths()): Promise<DiskInfo[]> {
  const results: DiskInfo[] = [];

  for (const diskPath of paths) {
    try {
      const stats = await statfs(diskPath);
      results.push({
        path: diskPath,
        totalBytes: stats.blocks * stats.bsize,
        freeBytes: stats.bfree * stats.bsize,
        availableBytes: stats.bavail * stats.bsize,
      });
    } catch (err) {
      console.warn(`[agent] Failed to get disk info for ${diskPath}:`, err);
    }
  }

  return results;
}
