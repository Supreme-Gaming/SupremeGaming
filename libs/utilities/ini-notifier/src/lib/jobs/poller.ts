import { AppConfig } from '../config';
import { IniCache } from '../services/cache';
import { fetchIni } from '../services/fetcher';
import { parseIni } from '../services/parser';
import { diffIni } from '../services/diff';
import { sendChangeWebhook } from '../services/discord';

export class Poller {
  private timer?: NodeJS.Timeout;
  private running = false;

  constructor(private readonly config: AppConfig, private readonly cache: IniCache) {}

  async start() {
    if (this.running) return;
    this.running = true;
    await this.tick();
    this.timer = setInterval(() => void this.tick(), this.config.pollIntervalMs);
  }

  async stop() {
    this.running = false;
    if (this.timer) clearInterval(this.timer);
  }

  private async tick() {
    try {
      const current = this.cache.get();
      const res = await fetchIni(this.config.iniUrl, {
        etag: current.etag,
        timeoutMs: this.config.requestTimeoutMs,
      });

      if (res.status === 304) {
        return; // no change
      }

      if (res.status >= 400 || !res.text) {
        console.error(`[poller] fetch failure status=${res.status}`);
        return;
      }

      const parsed = parseIni(res.text);
      if (!this.cache.hasParsed()) {
        // First load: optionally notify with "all added" diff
        if (this.config.notifyOnInitial) {
          const prevParsed = {} as Record<string, unknown>;
          const nextParsed = parsed as Record<string, unknown>;
          const changes = diffIni(prevParsed, nextParsed).all;
          if (changes.length) {
            await sendChangeWebhook(
              this.config.discordWebhookUrl,
              this.config.notifierName,
              changes,
              this.config.embedTitle,
              this.config.embedColor
            );

            console.log(`[poller] initial cache: ${changes.length} setting(s) announced`);
          }
        }
        this.cache.set({ etag: res.etag, raw: res.text, parsed });
        console.log('[poller] initial INI cached');
        return;
      }

      const prevParsed = (current.parsed as Record<string, unknown>) ?? {};
      const nextParsed = parsed as Record<string, unknown>;
      const changes = diffIni(prevParsed, nextParsed).all;
      if (changes.length) {
        await sendChangeWebhook(
          this.config.discordWebhookUrl,
          this.config.notifierName,
          changes,
          this.config.embedTitle,
          this.config.embedColor
        );
        console.log(`[poller] ${changes.length} change(s) notified`);
      }

      this.cache.set({ etag: res.etag, raw: res.text, parsed });
    } catch (err) {
      console.error('[poller] tick error', err);
    }
  }
}
