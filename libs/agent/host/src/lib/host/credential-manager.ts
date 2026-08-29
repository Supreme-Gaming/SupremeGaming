import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CREDENTIALS_DIR = join(homedir(), '.sg-agent');
const CREDENTIALS_FILE = join(CREDENTIALS_DIR, 'credentials.json');
const EX_CONFIG = 78;

interface Credentials {
  refreshToken: string;
  agentId: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AgentCredentialManager {
  private accessToken = '';
  private refreshToken = '';
  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly apiUrl: string, private readonly agentId: string) {}

  /**
   * Initialize credentials: register if first boot, otherwise refresh from persisted token.
   */
  async init(): Promise<void> {
    const registrationToken = process.env.REGISTRATION_TOKEN;
    const persisted = this.loadFromDisk();

    if (persisted) {
      console.log('[agent] Found persisted credentials, refreshing tokens...');
      await this.refresh();
    } else if (registrationToken) {
      console.log('[agent] First boot — exchanging registration token...');
      await this.register(registrationToken);
    } else {
      console.error('[agent] No credentials found and no REGISTRATION_TOKEN set. Cannot authenticate.');
      process.exit(EX_CONFIG);
    }

    this.startProactiveRefresh();
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getAgentId(): string {
    return this.agentId;
  }

  /**
   * Refresh tokens (called reactively on connect_error or proactively on timer).
   */
  async refresh(): Promise<void> {
    const persisted = this.loadFromDisk();

    if (!persisted) {
      console.error('[agent] No refresh token available — cannot refresh');
      process.exit(EX_CONFIG);
    }

    const res = await fetch(`${this.apiUrl}/agents/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: persisted.refreshToken, agentId: this.agentId }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));

      if (body.action === 're-register') {
        console.error('[agent] Refresh token expired — agent must be re-registered by an admin');
        this.clearDisk();
        process.exit(EX_CONFIG);
      }

      throw new Error(`Token refresh failed: ${res.status} ${JSON.stringify(body)}`);
    }

    const data = (await res.json()) as TokenResponse;

    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    this.persistToDisk();

    console.log('[agent] Tokens refreshed successfully');
  }

  stop(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private async register(registrationToken: string): Promise<void> {
    const res = await fetch(`${this.apiUrl}/agents/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationToken, agentId: this.agentId }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[agent] Registration failed: ${res.status} ${body}`);
      process.exit(EX_CONFIG);
    }

    const data = (await res.json()) as TokenResponse;
    
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    this.persistToDisk();

    console.log('[agent] Registration successful');
  }

  private startProactiveRefresh(): void {
    // Refresh every 12 minutes (access token expires in 15 min)
    const REFRESH_INTERVAL_MS = 12 * 60 * 1000;

    this.refreshTimer = setInterval(async () => {
      try {
        await this.refresh();
      } catch (err) {
        console.error('[agent] Proactive token refresh failed:', err);
      }
    }, REFRESH_INTERVAL_MS);
  }

  private persistToDisk(): void {
    try {
      if (!existsSync(CREDENTIALS_DIR)) {
        mkdirSync(CREDENTIALS_DIR, { recursive: true, mode: 0o700 });
      }

      const data: Credentials = { refreshToken: this.refreshToken, agentId: this.agentId };
      writeFileSync(CREDENTIALS_FILE, JSON.stringify(data), { mode: 0o600 });
    } catch (err) {
      console.error('[agent] Failed to persist credentials:', err);
    }
  }

  private loadFromDisk(): Credentials | null {
    try {
      if (!existsSync(CREDENTIALS_FILE)) return null;
      
      const raw = readFileSync(CREDENTIALS_FILE, 'utf-8');
      const data = JSON.parse(raw) as Credentials;

      if (data.agentId !== this.agentId) {
        console.warn('[agent] Persisted credentials are for a different agent — ignoring');
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  private clearDisk(): void {
    try {
      if (existsSync(CREDENTIALS_FILE)) {
        unlinkSync(CREDENTIALS_FILE);
      }
    } catch {
      // ignore
    }
  }
}
