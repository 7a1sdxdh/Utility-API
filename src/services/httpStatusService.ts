import { HttpStatusResult } from '../types';
import { AppError } from '../utils/AppError';

interface StatusInfo {
  message: string;
  description: string;
}

/**
 * 주요 HTTP 상태 코드 사전.
 * 필요 시 이 객체에만 항목을 추가하면 새로운 코드를 손쉽게 지원할 수 있다.
 */
const HTTP_STATUS_MAP: Record<number, StatusInfo> = {
  100: { message: 'Continue', description: '클라이언트가 요청을 계속 진행해도 됨을 의미합니다.' },
  101: { message: 'Switching Protocols', description: '서버가 프로토콜 전환 요청을 승낙했습니다.' },
  200: { message: 'OK', description: '요청이 성공적으로 처리되었습니다.' },
  201: { message: 'Created', description: '요청이 성공하여 새로운 리소스가 생성되었습니다.' },
  202: { message: 'Accepted', description: '요청이 접수되었으나 아직 처리가 완료되지 않았습니다.' },
  204: { message: 'No Content', description: '요청은 성공했지만 응답할 콘텐츠가 없습니다.' },
  301: { message: 'Moved Permanently', description: '요청한 리소스가 새로운 URL로 영구적으로 이동했습니다.' },
  302: { message: 'Found', description: '요청한 리소스가 일시적으로 다른 URL에 있습니다.' },
  304: { message: 'Not Modified', description: '리소스가 변경되지 않아 캐시된 버전을 사용할 수 있습니다.' },
  307: { message: 'Temporary Redirect', description: '요청 메서드를 유지한 채 임시로 다른 URL로 리다이렉트됩니다.' },
  308: { message: 'Permanent Redirect', description: '요청 메서드를 유지한 채 영구적으로 다른 URL로 리다이렉트됩니다.' },
  400: { message: 'Bad Request', description: '서버가 이해할 수 없는 잘못된 요청입니다.' },
  401: { message: 'Unauthorized', description: '인증이 필요한 요청입니다.' },
  402: { message: 'Payment Required', description: '결제가 필요합니다 (예약된 상태 코드).' },
  403: { message: 'Forbidden', description: '서버가 요청을 이해했지만 접근이 거부되었습니다.' },
  404: { message: 'Not Found', description: '요청한 리소스를 찾을 수 없습니다.' },
  405: { message: 'Method Not Allowed', description: '요청 메서드가 허용되지 않습니다.' },
  406: { message: 'Not Acceptable', description: '요청한 리소스가 요청 헤더 조건을 만족시킬 수 없습니다.' },
  408: { message: 'Request Timeout', description: '서버가 클라이언트 요청을 기다리다 시간이 초과되었습니다.' },
  409: { message: 'Conflict', description: '요청이 현재 서버 상태와 충돌합니다.' },
  410: { message: 'Gone', description: '요청한 리소스가 영구적으로 삭제되었습니다.' },
  413: { message: 'Payload Too Large', description: '요청 본문이 서버가 처리할 수 있는 한도를 초과했습니다.' },
  415: { message: 'Unsupported Media Type', description: '요청한 미디어 타입을 서버가 지원하지 않습니다.' },
  418: { message: "I'm a teapot", description: '서버가 커피포트로 차를 끓이길 거부했습니다 (만우절 농담 코드).' },
  422: { message: 'Unprocessable Entity', description: '요청 구문은 올바르지만 의미상 처리할 수 없습니다.' },
  429: { message: 'Too Many Requests', description: '일정 시간 동안 너무 많은 요청을 보냈습니다.' },
  500: { message: 'Internal Server Error', description: '서버 내부에 예상치 못한 오류가 발생했습니다.' },
  501: { message: 'Not Implemented', description: '서버가 요청을 처리할 기능을 지원하지 않습니다.' },
  502: { message: 'Bad Gateway', description: '게이트웨이 또는 프록시 서버가 잘못된 응답을 받았습니다.' },
  503: { message: 'Service Unavailable', description: '서버가 일시적으로 요청을 처리할 수 없습니다.' },
  504: { message: 'Gateway Timeout', description: '게이트웨이 또는 프록시 서버가 시간 내에 응답을 받지 못했습니다.' },
};

export function getHttpStatusInfo(code: number): HttpStatusResult {
  const info = HTTP_STATUS_MAP[code];

  if (!info) {
    throw new AppError(`등록되지 않은 HTTP 상태 코드입니다: ${code}`, 404);
  }

  return { code, message: info.message, description: info.description };
}
