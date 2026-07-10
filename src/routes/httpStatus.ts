import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { getHttpStatusInfo } from '../services/httpStatusService';
import { parseQuery, httpStatusQuerySchema } from '../utils/validators';
import { sendSuccess } from '../utils/response';

const router = Router();

/**
 * GET /http-status?code=404
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { code } = parseQuery(httpStatusQuerySchema, req.query);
    const result = getHttpStatusInfo(code);
    sendSuccess(res, result);
  }),
);

export default router;
