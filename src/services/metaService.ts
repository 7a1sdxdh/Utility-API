import axios from 'axios';
import * as cheerio from 'cheerio';
import { env } from '../config/env';
import { MetaResult } from '../types';
import { AppError } from '../utils/AppError';

/**
 * 상대경로/프로토콜상대경로 favicon URL을 절대경로로 변환한다.
 */
function resolveUrl(base: string, maybeRelative: string | undefined): string | null {
  if (!maybeRelative) return null;
  try {
    return new URL(maybeRelative, base).toString();
  } catch {
    return null;
  }
}

export async function fetchMeta(targetUrl: string): Promise<MetaResult> {
  let html: string;

  try {
    const response = await axios.get<string>(targetUrl, {
      timeout: env.REQUEST_TIMEOUT_MS,
      responseType: 'text',
      maxRedirects: 10,
      headers: {
        'User-Agent': 'utility-api/1.0 (+https://vercel.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
      validateStatus: (status) => status < 400,
    });
    html = response.data;
  } catch {
    throw new AppError(`${targetUrl} 페이지를 가져오는 중 오류가 발생했습니다.`, 502);
  }

  const $ = cheerio.load(html);

  const title = $('title').first().text().trim() || null;

  const description =
    $('meta[name="description"]').attr('content')?.trim() ||
    $('meta[property="description"]').attr('content')?.trim() ||
    null;

  const rawFavicon =
    $('link[rel="icon"]').attr('href') ||
    $('link[rel="shortcut icon"]').attr('href') ||
    $('link[rel="apple-touch-icon"]').attr('href') ||
    '/favicon.ico';

  const ogTitle = $('meta[property="og:title"]').attr('content')?.trim() || null;
  const ogDescription = $('meta[property="og:description"]').attr('content')?.trim() || null;
  const rawOgImage = $('meta[property="og:image"]').attr('content')?.trim();

  return {
    url: targetUrl,
    title,
    description,
    favicon: resolveUrl(targetUrl, rawFavicon),
    ogTitle,
    ogDescription,
    ogImage: resolveUrl(targetUrl, rawOgImage),
  };
}
