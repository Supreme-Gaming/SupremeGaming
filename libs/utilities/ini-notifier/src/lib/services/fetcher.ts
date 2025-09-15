import axios from 'axios';

export interface FetchResult {
  status: number;
  text?: string;
  etag?: string;
}

export async function fetchIni(url: string, opts?: { etag?: string; timeoutMs?: number }): Promise<FetchResult> {
  const res = await axios.get(url, {
    headers: {
      ...(opts?.etag ? { 'If-None-Match': opts.etag } : {}),
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    timeout: opts?.timeoutMs ?? 15_000,
    // Don't throw on non-2xx; we want to handle 304 or errors ourselves
    validateStatus: () => true,
    responseType: 'text',
    transformResponse: (d) => d, // keep as text
  });

  if (res.status === 304) {
    return { status: 304 };
  }

  const text = typeof res.data === 'string' ? res.data : String(res.data ?? '');
  const etag = (res.headers?.etag as string | undefined) || undefined;
  return { status: res.status, text, etag };
}
