import { Router } from 'express';
import urlRouter from './url';
import ipRouter from './ip';
import dnsRouter from './dns';
import sslRouter from './ssl';
import metaRouter from './meta';
import httpStatusRouter from './httpStatus';
import { sendSuccess } from '../utils/response';

const router = Router();

/**
 * 헬스체크 / 루트 엔드포인트
 */
router.get('/', (_req, res) => {
  sendSuccess(res, {
    name: 'utility-api',
    status: 'ok',
    endpoints: ['/url', '/ip', '/dns', '/ssl', '/meta', '/http-status'],
  });
});

// 새로운 API를 추가할 때는 이 파일에 라우터 한 줄만 등록하면 된다.
router.use('/url', urlRouter);
router.use('/ip', ipRouter);
router.use('/dns', dnsRouter);
router.use('/ssl', sslRouter);
router.use('/meta', metaRouter);
router.use('/http-status', httpStatusRouter);

export default router;
