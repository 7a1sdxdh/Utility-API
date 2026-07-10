import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { fetchMeta } from '../services/metaService';
import { parseQuery, urlQuerySchema } from '../utils/validators';
import { sendSuccess } from '../utils/response';

const router = Router();

/**
 * GET /meta?url=https://example.com
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { url } = parseQuery(urlQuerySchema, req.query);
    const result = await fetchMeta(url);
    sendSuccess(res, result);
  }),
);

export default router;
