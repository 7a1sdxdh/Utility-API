import axios from 'axios';
import { env } from '../config/env';
import { IpLookupResult } from '../types';
import { AppError } from '../utils/AppError';

/**
 * ip-api.com 무료 API를 통해 IP 위치/조직 정보를 조회한다.
 * 문서: https://ip-api.com/docs/api:json
 */
interface IpApiRawResponse {
  status: 'success' | 'fail';
  message?: string;
  query: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  isp?: string;
  org?: string;
  as?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  proxy?: boolean;
  hosting?: boolean;
}

const IP_API_FIELDS =
  'status,message,query,country,countryCode,region,regionName,city,isp,org,as,lat,lon,timezone,proxy,hosting';

export async function lookupIp(ip: string): Promise<IpLookupResult> {
  try {
    const response = await axios.get<IpApiRawResponse>(`http://ip-api.com/json/${ip}`, {
      timeout: env.REQUEST_TIMEOUT_MS,
      params: {
        fields: IP_API_FIELDS,
        lang: env.IP_API_LANG,
      },
    });

    const data = response.data;

    if (data.status === 'fail') {
      throw new AppError(data.message ?? '유효하지 않은 IP 주소입니다.', 400);
    }

    return {
      ip: data.query,
      country: data.country ?? null,
      countryCode: data.countryCode ?? null,
      region: data.region ?? null,
      regionName: data.regionName ?? null,
      city: data.city ?? null,
      isp: data.isp ?? null,
      org: data.org ?? null,
      as: data.as ?? null,
      lat: data.lat ?? null,
      lon: data.lon ?? null,
      timezone: data.timezone ?? null,
      proxy: data.proxy ?? false,
      hosting: data.hosting ?? false,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('IP 정보를 조회하는 중 오류가 발생했습니다.', 502);
  }
}
