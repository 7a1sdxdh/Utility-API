import app from './app';
import { env } from './config/env';

/**
 * 로컬 개발 환경 전용 진입점.
 * Vercel 배포 시에는 사용되지 않으며, `npm run dev` / `npm start`로만 실행된다.
 */
app.listen(env.PORT, () => {
  console.log(`🚀 utility-api server is running on http://localhost:${env.PORT}`);
});
