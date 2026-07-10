import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { lookupDns } from '../services/dnsService';
import { parseQuery, domainQuerySchema } from '../utils/validators';
import { sendSuccess } from '../utils/response';

const router = Router();

/**
 * GET /dns?domain=google.com
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { domain } = parseQuery(domainQuerySchema, req.query);
    const result = await lookupDns(domain);
    sendSuccess(res, result);
  }),
);

export default router;
