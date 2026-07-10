import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { checkUrl } from '../services/urlService';
import { parseQuery, urlQuerySchema } from '../utils/validators';
import { sendSuccess } from '../utils/response';

const router = Router();

/**
 * GET /url?url=https://example.com
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { url } = parseQuery(urlQuerySchema, req.query);
    const result = await checkUrl(url);
    sendSuccess(res, result);
  }),
);

export default router;
