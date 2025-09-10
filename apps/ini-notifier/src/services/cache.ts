export interface CachedIni {
  etag?: string;
  raw?: string;
  parsed?: Record<string, unknown>;
}

export class IniCache {
  private current: CachedIni = {};

  get(): CachedIni {
    return this.current;
  }

  set(next: CachedIni) {
    this.current = { ...this.current, ...next };
  }

  hasParsed(): boolean {
    return !!this.current.parsed;
  }
}
