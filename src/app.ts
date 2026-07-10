import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { requestLogger } from './middleware/requestLogger';
import { rateLimiter } from './middleware/rateLimiter';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler';
import routes from './routes';

/**
 * Express 애플리케이션을 생성하고 공통 미들웨어 및 라우트를 등록한다.
 * Vercel(api/index.ts)과 로컬 실행(src/local.ts) 양쪽에서 이 팩토리를 공유한다.
 */
export function createApp(): Express {
  const app = express();

  // Vercel 등 프록시 뒤에서 실제 클라이언트 IP를 얻고, express-rate-limit이
  // X-Forwarded-For 헤더를 안전하게 사용하도록 신뢰 프록시를 지정한다.
  app.set('trust proxy', 1);

  // 보안 헤더
  app.use(helmet());

  // CORS
  const origin = env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(',').map((o) => o.trim());
  app.use(cors({ origin }));

  // Body 파서
  app.use(express.json());

  // 요청 로그
  app.use(requestLogger);

  // Rate limit (전체 API 공통)
  app.use(rateLimiter);

  // 라우트
  app.use('/', routes);

  // 404 및 전역 에러 핸들러 (반드시 라우트 등록 이후에 위치)
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
}

// Vercel Serverless가 이 파일을 진입점으로 잡아도 정상 동작하도록 기본 내보내기를 제공한다.
export default createApp();
