import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { env } from '../config/env';
import { ApiErrorResponse } from '../types';

/**
 * 전체 API 공통 Rate Limiter.
 * 서버리스(Vercel) 환경에서는 인스턴스별 메모리 저장소이므로
 * 완벽한 전역 제한은 아니지만, 남용 방지 용도로는 충분하다.
 */
export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    const body: ApiErrorResponse = {
      success: false,
      error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    };
    res.status(429).json(body);
  },
});
