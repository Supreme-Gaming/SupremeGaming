export const machineAuthConfig = {
  machineJwtSecret: process.env.MACHINE_JWT_SECRET || '',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenTtlMs: parseInt(process.env.REFRESH_TOKEN_TTL_MS || String(90 * 24 * 60 * 60 * 1000), 10),
  registrationTokenTtl: process.env.REGISTRATION_TOKEN_TTL || '1h',
  // When true, POST /agents/registration-tokens skips Steam/session JWT.
  // Machine auth (MACHINE_JWT_SECRET) is unchanged. Dev-only.
  devOpenRegistration: process.env.DEV_OPEN_REGISTRATION === 'true',
};
