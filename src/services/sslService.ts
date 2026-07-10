import * as tls from 'tls';
import { env } from '../config/env';
import { SslCertificateResult } from '../types';
import { AppError } from '../utils/AppError';

/**
 * 인증서 subject/issuer 객체를 "CN=..., O=..." 형태의 문자열로 변환한다.
 */
function formatCertName(name: Record<string, string | string[] | undefined>): string {
  return Object.entries(name)
    .filter((entry): entry is [string, string | string[]] => entry[1] !== undefined)
    .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(', ') : value}`)
    .join(', ');
}

/**
 * 도메인에 TLS 연결을 시도하여 인증서 정보를 조회한다.
 */
export function getSslCertificate(domain: string): Promise<SslCertificateResult> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host: domain,
        port: 443,
        servername: domain,
        timeout: env.REQUEST_TIMEOUT_MS,
        rejectUnauthorized: false,
      },
      () => {
        try {
          const cert = socket.getPeerCertificate();
          socket.end();

          if (!cert || Object.keys(cert).length === 0) {
            reject(new AppError(`${domain}의 SSL 인증서를 가져올 수 없습니다.`, 502));
            return;
          }

          const validFrom = new Date(cert.valid_from);
          const validTo = new Date(cert.valid_to);
          const daysLeft = Math.ceil((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          resolve({
            domain,
            issuer: formatCertName(cert.issuer),
            subject: formatCertName(cert.subject),
            validFrom: validFrom.toISOString(),
            validTo: validTo.toISOString(),
            daysLeft,
            valid: daysLeft > 0,
          });
        } catch {
          reject(new AppError(`${domain}의 SSL 인증서를 파싱하는 중 오류가 발생했습니다.`, 502));
        }
      },
    );

    socket.on('timeout', () => {
      socket.destroy();
      reject(new AppError(`${domain}에 대한 TLS 연결이 타임아웃되었습니다.`, 504));
    });

    socket.on('error', (err) => {
      reject(new AppError(`${domain}에 TLS 연결할 수 없습니다: ${err.message}`, 502));
    });
  });
}
