import 'dotenv/config';

/**
 * 환경변수를 한곳에서 파싱/검증하여 애플리케이션 전역에서 타입 안전하게 사용한다.
 */
function toNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  PORT: toNumber(process.env.PORT, 3000),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
  RATE_LIMIT_WINDOW_MS: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  RATE_LIMIT_MAX: toNumber(process.env.RATE_LIMIT_MAX, 60),
  REQUEST_TIMEOUT_MS: toNumber(process.env.REQUEST_TIMEOUT_MS, 10_000),
  IP_API_LANG: process.env.IP_API_LANG ?? 'en',
} as const;
