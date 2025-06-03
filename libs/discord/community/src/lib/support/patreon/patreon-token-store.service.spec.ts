import { PatreonTokenStore, dbForTesting as originalDb } from './patreon-token-store.service';
import * as PatreonAPI from 'patreon-api.ts';

// Define what the mock implementations should do
const mockGetPatreonToken = jest.fn();
const mockSetPatreonToken = jest.fn();
const mockDeletePatreonToken = jest.fn();

describe('PatreonTokenStore', () => {
  let store: PatreonTokenStore;
  const initialAccessToken = 'initial_access_token';
  const initialRefreshToken = 'initial_refresh_token';
  const mockTokenFromDb: PatreonAPI.StoredToken = {
    access_token: 'db_access_token',
    refresh_token: 'db_refresh_token',
    expires_in: '7200',
    scope: 'users pledges',
    token_type: 'Bearer',
    created_at: (Date.now() / 1000 - 1000).toString(),
    expires_in_epoch: ((Date.now() / 1000 - 1000) + 7200).toString(),
  } as PatreonAPI.StoredToken;

  beforeEach(() => {
    // Reset and re-mock implementations for each test
    mockGetPatreonToken.mockReset();
    mockSetPatreonToken.mockReset();
    mockDeletePatreonToken.mockReset();

    jest.spyOn(originalDb, 'getPatreonToken').mockImplementation(mockGetPatreonToken);
    jest.spyOn(originalDb, 'setPatreonToken').mockImplementation(mockSetPatreonToken);
    jest.spyOn(originalDb, 'deletePatreonToken').mockImplementation(mockDeletePatreonToken);

    store = new PatreonTokenStore(initialAccessToken, initialRefreshToken);
  });

  afterEach(() => {
    // Restore original implementations after each test
    jest.restoreAllMocks();
  });

  describe('get', () => {
    it('should return token from DB if available', async () => {
      mockGetPatreonToken.mockResolvedValue(mockTokenFromDb);
      const token = await store.get();
      expect(token).toEqual(mockTokenFromDb);
      expect(mockGetPatreonToken).toHaveBeenCalledTimes(1);
      expect(mockSetPatreonToken).not.toHaveBeenCalled();
    });

    it('should return initial token and store it if DB is empty and initial tokens are provided', async () => {
      mockGetPatreonToken.mockResolvedValue(null); // Simulate DB empty
      const getOptions = { key: 'testKey' };
      const token = await store.get(getOptions);

      expect(mockGetPatreonToken).toHaveBeenCalledTimes(1);
      expect(token).not.toBeUndefined();
      expect(token?.access_token).toBe(initialAccessToken);
      expect(token?.refresh_token).toBe(initialRefreshToken);
      expect(token?.expires_in).toBe('3600');
      expect(mockSetPatreonToken).toHaveBeenCalledTimes(1);
      expect(mockSetPatreonToken).toHaveBeenCalledWith( // originalDb.setPatreonToken only gets the token
        expect.objectContaining({
          access_token: initialAccessToken,
          refresh_token: initialRefreshToken,
        })
      );
    });

    it('should return undefined if DB is empty and no initial tokens are provided', async () => {
      store = new PatreonTokenStore(null as any, null as any);
      mockGetPatreonToken.mockResolvedValue(null);
      const token = await store.get();

      expect(token).toBeUndefined();
      expect(mockGetPatreonToken).toHaveBeenCalledTimes(1);
      expect(mockSetPatreonToken).not.toHaveBeenCalled();
    });
  });

  describe('put', () => {
    it('should store the token using db.setPatreonToken', async () => {
      const putOptions = { key: 'customPutKey' };
      await store.put(mockTokenFromDb, putOptions);
      expect(mockSetPatreonToken).toHaveBeenCalledTimes(1);
      expect(mockSetPatreonToken).toHaveBeenCalledWith(mockTokenFromDb); // originalDb.setPatreonToken only gets the token
    });
  });

  describe('delete', () => {
    it('should delete the token using db.deletePatreonToken', async () => {
      const deleteOptions = { key: 'customDeleteKey' };
      await store.delete(deleteOptions);
      expect(mockDeletePatreonToken).toHaveBeenCalledTimes(1);
      expect(mockDeletePatreonToken).toHaveBeenCalledWith();
    });
  });

  describe('list', () => {
    it('should return an array with the token if available via get', async () => {
      const listOptions = { key: 'customListKey' };
      mockGetPatreonToken.mockResolvedValue(mockTokenFromDb);
      const list = await store.list(listOptions);
      expect(list).toEqual([mockTokenFromDb]);
      expect(mockGetPatreonToken).toHaveBeenCalledTimes(1);
      expect(mockGetPatreonToken).toHaveBeenCalledWith(); // originalDb.getPatreonToken takes no args
    });

    it('should return an empty array if no token is available via get', async () => {
      store = new PatreonTokenStore(null as any, null as any);
      const listOptions = { key: 'anotherListKey' };
      mockGetPatreonToken.mockResolvedValue(null);
      const list = await store.list(listOptions);
      expect(list).toEqual([]);
      expect(mockGetPatreonToken).toHaveBeenCalledTimes(1);
      expect(mockGetPatreonToken).toHaveBeenCalledWith(); // originalDb.getPatreonToken takes no args
    });
  });
});
