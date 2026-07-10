/**
 * 모든 API가 공통으로 사용하는 응답 포맷 타입
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * API 1: /url
 */
export interface UrlCheckResult {
  online: boolean;
  status: number | null;
  statusText: string | null;
  responseTime: number;
  finalUrl: string;
  redirects: number;
  protocol: string;
  hostname: string;
}

/**
 * API 2: /ip
 */
export interface IpLookupResult {
  ip: string;
  country: string | null;
  countryCode: string | null;
  region: string | null;
  regionName: string | null;
  city: string | null;
  isp: string | null;
  org: string | null;
  as: string | null;
  lat: number | null;
  lon: number | null;
  timezone: string | null;
  proxy: boolean;
  hosting: boolean;
}

/**
 * API 3: /dns
 */
export interface DnsLookupResult {
  domain: string;
  A: string[];
  AAAA: string[];
  MX: { exchange: string; priority: number }[];
  NS: string[];
  TXT: string[][];
  CNAME: string[];
}

/**
 * API 4: /ssl
 */
export interface SslCertificateResult {
  domain: string;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysLeft: number;
  valid: boolean;
}

/**
 * API 5: /meta
 */
export interface MetaResult {
  url: string;
  title: string | null;
  description: string | null;
  favicon: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

/**
 * API 6: /http-status
 */
export interface HttpStatusResult {
  code: number;
  message: string;
  description: string;
}

/**
 * 애플리케이션 전역에서 사용하는 커스텀 에러 클래스에서 참조하는
 * HTTP 상태코드가 포함된 에러 정보 타입
 */
export interface HttpErrorLike {
  statusCode: number;
  message: string;
}
