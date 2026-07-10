import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { getSslCertificate } from '../services/sslService';
import { parseQuery, domainQuerySchema } from '../utils/validators';
import { sendSuccess } from '../utils/response';

const router = Router();

/**
 * GET /ssl?domain=google.com
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { domain } = parseQuery(domainQuerySchema, req.query);
    const result = await getSslCertificate(domain);
    sendSuccess(res, result);
  }),
);

export default router;
