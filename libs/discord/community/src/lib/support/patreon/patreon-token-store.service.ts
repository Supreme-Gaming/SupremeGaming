import * as PatreonAPI from 'patreon-api.ts';

// This is a placeholder for the actual database service
// In a real application, this would be injected or imported
const db = {
  async getPatreonToken(): Promise<PatreonAPI.StoredToken | null> { // db methods don't need to change for this
    // TODO: Implement actual database retrieval logic
    console.log('Attempting to retrieve Patreon token from DB');
    // For now, simulate no token in DB to allow initial env var loading
    return null;
  },
  async setPatreonToken(token: PatreonAPI.StoredToken): Promise<void> {
    // TODO: Implement actual database storage logic
    console.log('Storing Patreon token to DB:', token);
  },
  async deletePatreonToken(): Promise<void> {
    // TODO: Implement actual database deletion logic
    console.log('Deleting Patreon token from DB');
  },
};

// Export db for testing purposes
export { db as dbForTesting };

export class PatreonTokenStore implements PatreonAPI.PatreonTokenFetchOptions {
  constructor(
    private readonly initialAccessToken: string,
    private readonly initialRefreshToken: string
  ) {}

  async get(options?: { isCreatorToken?: boolean; key?: string; }): Promise<PatreonAPI.StoredToken | undefined> {
    let token = await db.getPatreonToken();
    if (!token) {
      // If no token in DB, use initial tokens from env vars (passed in constructor)
      // and a creation time for that.
      // Patreon creator tokens don't have an expiry, but the lib needs one.
      // Setting a short expiry to force refresh if this initial token is ever used.
      if (this.initialAccessToken && this.initialRefreshToken) {
        console.log('Using initial Patreon tokens from environment variables.');
        const currentTimeInSeconds = Date.now() / 1000;
        const expiresInSeconds = 3600;
        token = {
          access_token: this.initialAccessToken,
          refresh_token: this.initialRefreshToken,
          expires_in: expiresInSeconds.toString(), // Simulate 1 hour expiry for initial token
          scope: '', // Scope is not typically returned for creator tokens
          token_type: 'Bearer',
          created_at: currentTimeInSeconds.toString(), // seconds
          expires_in_epoch: (currentTimeInSeconds + expiresInSeconds).toString(),
        } as PatreonAPI.StoredToken;
        // Store this initial token to the DB so it can be refreshed
        await this.put(token, options); // Pass options along
        return token;
      }
      console.log('No Patreon token found in DB and no initial tokens provided.');
      return undefined; // Changed from null
    }
    console.log('Retrieved Patreon token from DB.');
    return token;
  }

  async put(value: PatreonAPI.StoredToken, options?: { isCreatorToken?: boolean; key?: string; }): Promise<void> {
    console.log('PatreonTokenStore: put operation called for token:', value, 'with options:', options);
    await db.setPatreonToken(value);
  }

  async delete(options?: { isCreatorToken?: boolean; key?: string; }): Promise<void> {
    console.log('PatreonTokenStore: delete operation called with options:', options);
    await db.deletePatreonToken();
  }

  // The list method is optional and not strictly needed for creator token refresh.
  async list(options?: { isCreatorToken?: boolean; key?: string; }): Promise<PatreonAPI.StoredToken[]> {
    console.log('PatreonTokenStore: list operation called with options:', options);
    const token = await this.get(options); // Pass options along
    return token ? [token] : [];
  }
}
