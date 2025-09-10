export interface IniChange {
  key: string; // e.g. "Section.key" or "key"
  type: 'added' | 'removed' | 'modified';
  oldValue?: unknown;
  newValue?: unknown;
}

export interface DiffResult {
  added: IniChange[];
  removed: IniChange[];
  modified: IniChange[];
  all: IniChange[];
}

type AnyRecord = Record<string, unknown>;

function flatten(obj: AnyRecord, prefix = ''): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj || {})) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v as AnyRecord, path));
    } else {
      out[path] = v;
    }
  }
  return out;
}

export function diffIni(prev: AnyRecord = {}, next: AnyRecord = {}): DiffResult {
  const fPrev = flatten(prev);
  const fNext = flatten(next);

  const added: IniChange[] = [];
  const removed: IniChange[] = [];
  const modified: IniChange[] = [];

  const allKeys = new Set([...Object.keys(fPrev), ...Object.keys(fNext)]);
  for (const key of allKeys) {
    const a = fPrev[key];
    const b = fNext[key];
    if (!(key in fPrev)) {
      added.push({ key, type: 'added', newValue: b });
    } else if (!(key in fNext)) {
      removed.push({ key, type: 'removed', oldValue: a });
    } else if (a !== b) {
      modified.push({ key, type: 'modified', oldValue: a, newValue: b });
    }
  }

  const all = [...added, ...removed, ...modified];
  return { added, removed, modified, all };
}
