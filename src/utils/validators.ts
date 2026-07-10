import { z, ZodSchema } from 'zod';
import { AppError } from './AppError';

/**
 * query 파라미터를 주어진 zod 스키마로 검증하고, 실패 시 AppError(400)를 던진다.
 */
export function parseQuery<T>(schema: ZodSchema<T, z.ZodTypeDef, unknown>, query: unknown): T {
  const result = schema.safeParse(query);
  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(', ');
    throw new AppError(message || '입력값이 올바르지 않습니다.', 400);
  }
  return result.data;
}

/** GET /url?url= */
export const urlQuerySchema = z.object({
  url: z
    .string({ required_error: 'url 파라미터는 필수입니다.' })
    .min(1, 'url 파라미터는 필수입니다.')
    .url('올바른 URL 형식이 아닙니다.')
    .refine((value) => /^https?:\/\//i.test(value), {
      message: 'http 또는 https URL만 허용됩니다.',
    }),
});

/** GET /ip?ip= */
const IPV4_REGEX =
  /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
const IPV6_REGEX = /^([0-9a-fA-F]{1,4}:){2,7}[0-9a-fA-F]{0,4}$|^::1$|^::$/;

export const ipQuerySchema = z.object({
  ip: z
    .string({ required_error: 'ip 파라미터는 필수입니다.' })
    .min(1, 'ip 파라미터는 필수입니다.')
    .refine((value) => IPV4_REGEX.test(value) || IPV6_REGEX.test(value), {
      message: '올바른 IP 주소 형식이 아닙니다.',
    }),
});

/** GET /dns?domain= */
const DOMAIN_REGEX =
  /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))+$/;

export const domainQuerySchema = z.object({
  domain: z
    .string({ required_error: 'domain 파라미터는 필수입니다.' })
    .min(1, 'domain 파라미터는 필수입니다.')
    .refine((value) => DOMAIN_REGEX.test(value), {
      message: '올바른 도메인 형식이 아닙니다.',
    }),
});

/** GET /http-status?code= */
export const httpStatusQuerySchema = z.object({
  code: z
    .string({ required_error: 'code 파라미터는 필수입니다.' })
    .regex(/^\d+$/, 'code는 숫자여야 합니다.')
    .transform((value) => Number(value))
    .refine((value) => value >= 100 && value <= 599, {
      message: 'code는 100~599 사이의 값이어야 합니다.',
    }),
});
