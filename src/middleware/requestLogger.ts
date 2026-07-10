import { NextFunction, Request, Response } from 'express';

/**
 * 요청/응답 시간을 콘솔에 로깅하는 간단한 미들웨어.
 * Vercel 환경에서는 이 로그가 함수 실행 로그로 수집된다.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${method}] ${originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
}
