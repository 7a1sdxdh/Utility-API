import axios, { AxiosError } from 'axios';
import { env } from '../config/env';
import { UrlCheckResult } from '../types';
import { AppError } from '../utils/AppError';

/**
 * 주어진 URL에 HEAD 요청을 보내 온라인 상태, 응답시간, 리다이렉트 정보를 확인한다.
 */
export async function checkUrl(targetUrl: string): Promise<UrlCheckResult> {
  const parsed = new URL(targetUrl);
  let redirectCount = 0;

  const start = Date.now();

  try {
    const response = await axios.request({
      url: targetUrl,
      method: 'HEAD',
      timeout: env.REQUEST_TIMEOUT_MS,
      maxRedirects: 10,
      validateStatus: () => true,
      headers: {
        'User-Agent': 'utility-api/1.0 (+https://vercel.com)',
      },
      beforeRedirect: () => {
        redirectCount += 1;
      },
    });

    const responseTime = Date.now() - start;
    const finalUrl = response.request?.res?.responseUrl ?? targetUrl;
    const finalParsed = new URL(finalUrl);

    return {
      online: response.status < 400,
      status: response.status,
      statusText: response.statusText || null,
      responseTime,
      finalUrl,
      redirects: redirectCount,
      protocol: finalParsed.protocol.replace(':', ''),
      hostname: finalParsed.hostname,
    };
  } catch (error) {
    const responseTime = Date.now() - start;

    if (error instanceof AxiosError) {
      // 서버가 아예 응답하지 않는 경우 (DNS 실패, 연결 거부, 타임아웃 등)
      return {
        online: false,
        status: null,
        statusText: error.code ?? error.message,
        responseTime,
        finalUrl: targetUrl,
        redirects: redirectCount,
        protocol: parsed.protocol.replace(':', ''),
        hostname: parsed.hostname,
      };
    }

    throw new AppError('URL 상태를 확인하는 중 오류가 발생했습니다.', 502);
  }
}
