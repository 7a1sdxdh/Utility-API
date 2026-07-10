import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * 성공 응답을 통일된 포맷으로 전송한다.
 */
export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  const body: ApiResponse<T> = { success: true, data };
  res.status(statusCode).json(body);
}

/**
 * 실패 응답을 통일된 포맷으로 전송한다.
 * (직접 호출보다는 errorHandler 미들웨어를 통해 처리하는 것을 권장)
 */
export function sendError(res: Response, error: string, statusCode = 400): void {
  const body: ApiResponse<never> = { success: false, error };
  res.status(statusCode).json(body);
}
