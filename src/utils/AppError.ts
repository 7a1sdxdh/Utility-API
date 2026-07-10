/**
 * 애플리케이션 전역에서 사용하는 커스텀 에러.
 * statusCode를 함께 던져 errorHandler에서 적절한 HTTP 상태코드로 응답한다.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
