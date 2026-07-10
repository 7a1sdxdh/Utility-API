import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * async route handler 내부에서 발생한 예외를 자동으로 next(err)로 전달한다.
 * 모든 라우트 핸들러는 이 함수로 감싸서 사용한다.
 */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
