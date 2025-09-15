import { promises as fs } from 'fs';
import * as path from 'path';
import { IniCache } from './cache';

describe('IniCache', () => {
  let cache: IniCache;
  let testCacheDir: string;

  beforeEach(async () => {
    testCacheDir = path.join(__dirname, 'test-cache');
    // Clean up any existing test cache
    try {
      await fs.rm(testCacheDir, { recursive: true, force: true });
    } catch {
      // Ignore if directory doesn't exist
    }
    cache = new IniCache(testCacheDir);
    await cache.initialize();
  });

  afterEach(async () => {
    // Clean up test cache
    try {
      await fs.rm(testCacheDir, { recursive: true, force: true });
    } catch {
      // Ignore if directory doesn't exist
    }
  });

  it('should persist data to disk', async () => {
    const testData = {
      etag: 'test-etag',
      raw: '[section]\nkey=value',
      parsed: { section: { key: 'value' } },
    };

    await cache.set(testData);
    const retrieved = cache.get();

    expect(retrieved.etag).toBe(testData.etag);
    expect(retrieved.raw).toBe(testData.raw);
    expect(retrieved.parsed).toEqual(testData.parsed);
  });

  it('should load data from disk on initialization', async () => {
    const testData = {
      etag: 'test-etag',
      raw: '[section]\nkey=value',
      parsed: { section: { key: 'value' } },
    };

    // Create a new cache instance and save data
    const cache1 = new IniCache(testCacheDir);
    await cache1.initialize();
    await cache1.set(testData);

    // Create another instance and verify it loads the data
    const cache2 = new IniCache(testCacheDir);
    await cache2.initialize();
    const retrieved = cache2.get();

    expect(retrieved.etag).toBe(testData.etag);
    expect(retrieved.raw).toBe(testData.raw);
    expect(retrieved.parsed).toEqual(testData.parsed);
  });

  it('should handle missing cache file gracefully', async () => {
    const retrieved = cache.get();
    expect(retrieved.etag).toBeUndefined();
    expect(retrieved.raw).toBeUndefined();
    expect(retrieved.parsed).toBeUndefined();
    expect(cache.hasParsed()).toBe(false);
  });
});
