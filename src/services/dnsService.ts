import { promises as dns } from 'dns';
import { DnsLookupResult } from '../types';
import { AppError } from '../utils/AppError';

/**
 * 특정 레코드 타입 조회를 시도하고, 실패(레코드 없음 등)해도 예외를 던지지 않고
 * 빈 배열을 반환한다. 도메인 자체가 존재하지 않는 경우는 상위에서 별도 판별한다.
 */
async function safeResolve<T>(promise: Promise<T[]>): Promise<T[]> {
  try {
    return await promise;
  } catch {
    return [];
  }
}

export async function lookupDns(domain: string): Promise<DnsLookupResult> {
  const [A, AAAA, MX, NS, TXT, CNAME] = await Promise.all([
    safeResolve(dns.resolve4(domain)),
    safeResolve(dns.resolve6(domain)),
    safeResolve(dns.resolveMx(domain)),
    safeResolve(dns.resolveNs(domain)),
    safeResolve(dns.resolveTxt(domain)),
    safeResolve(dns.resolveCname(domain)),
  ]);

  const hasAnyRecord =
    A.length > 0 || AAAA.length > 0 || MX.length > 0 || NS.length > 0 || TXT.length > 0 || CNAME.length > 0;

  if (!hasAnyRecord) {
    throw new AppError(`도메인의 DNS 레코드를 찾을 수 없습니다: ${domain}`, 404);
  }

  return {
    domain,
    A,
    AAAA,
    MX: MX.map((record) => ({ exchange: record.exchange, priority: record.priority })),
    NS,
    TXT,
    CNAME,
  };
}
