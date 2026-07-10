import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { ApiErrorResponse } from '../types';

/**
 * 404 처리를 위한 미들웨어 (라우트 매칭 실패 시 마지막에 실행)
 */
export function notFoundHandler(req: Request, res: Response): void {
  const body: ApiErrorResponse = {
    success: false,
    error: `요청하신 경로를 찾을 수 없습니다: ${req.method} ${req.originalUrl}`,
  };
  res.status(404).json(body);
}

/**
 * 전역 에러 핸들러. AppError는 지정된 statusCode로, 그 외 예외는 500으로 응답한다.
 * express는 파라미터가 4개인 함수를 에러 핸들러로 인식하므로 시그니처를 유지해야 한다.
 */
export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof AppError) {
    const body: ApiErrorResponse = { success: false, error: err.message };
    res.status(err.statusCode).json(body);
    return;
  }

  const message = err instanceof Error ? err.message : '알 수 없는 서버 오류가 발생했습니다.';
  console.error('[UnhandledError]', err);

  const body: ApiErrorResponse = { success: false, error: message };
  res.status(500).json(body);
}
