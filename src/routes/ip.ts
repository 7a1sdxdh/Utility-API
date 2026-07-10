import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { lookupIp } from '../services/ipService';
import { parseQuery, ipQuerySchema } from '../utils/validators';
import { sendSuccess } from '../utils/response';

const router = Router();

/**
 * GET /ip?ip=8.8.8.8
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { ip } = parseQuery(ipQuerySchema, req.query);
    const result = await lookupIp(ip);
    sendSuccess(res, result);
  }),
);

export default router;
