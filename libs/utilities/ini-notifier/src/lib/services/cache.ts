import { promises as fs } from 'fs';
import * as path from 'path';

export interface CachedIni {
  etag?: string;
  raw?: string;
  parsed?: Record<string, unknown>;
}

export class IniCache {
  private current: CachedIni = {};
  private cacheFilePath: string;
  private initialized = false;

  constructor(cacheDir = './cache') {
    this.cacheFilePath = path.resolve(cacheDir, 'ini-cache.json');
    this.ensureCacheDirExists();
  }

  private async ensureCacheDirExists() {
    const cacheDir = path.dirname(this.cacheFilePath);
    try {
      await fs.access(cacheDir);
    } catch {
      await fs.mkdir(cacheDir, { recursive: true });
    }
  }

  async initialize() {
    if (this.initialized) return;
    await this.loadFromDisk();
    this.initialized = true;
  }

  private async loadFromDisk() {
    try {
      const data = await fs.readFile(this.cacheFilePath, 'utf-8');
      const cached = JSON.parse(data);
      if (cached && typeof cached === 'object') {
        this.current = cached;
        console.log('[cache] loaded from disk');
      }
    } catch (err) {
      // File doesn't exist or is corrupted, start with empty cache
      console.log('[cache] no existing cache found, starting fresh');
    }
  }

  private async saveToDisk() {
    try {
      await fs.writeFile(this.cacheFilePath, JSON.stringify(this.current, null, 2));
    } catch (err) {
      console.error('[cache] failed to save to disk:', err);
    }
  }

  get(): CachedIni {
    return this.current;
  }

  async set(next: CachedIni) {
    this.current = { ...this.current, ...next };
    await this.saveToDisk();
  }

  hasParsed(): boolean {
    return !!this.current.parsed;
  }
}
