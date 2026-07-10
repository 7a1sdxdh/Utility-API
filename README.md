# utility-api

Discord 봇 및 다른 프로젝트에서 공통으로 사용하는 **Utility API 서버**입니다.
Node.js 22 + TypeScript + Express로 작성되었으며, **Vercel Serverless**에 바로 배포할 수 있도록 설계되었습니다.

## 목차

- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행](#설치-및-실행)
- [환경 변수](#환경-변수)
- [공통 응답 포맷](#공통-응답-포맷)
- [API 명세](#api-명세)
- [Vercel 배포](#vercel-배포)
- [새로운 API 추가하는 법](#새로운-api-추가하는-법)
- [Postman Collection](#postman-collection)

## 기술 스택

| 분류 | 기술 |
| --- | --- |
| 런타임 | Node.js 22+ |
| 언어 | TypeScript (strict mode) |
| 웹 프레임워크 | Express |
| 배포 | Vercel Serverless Functions |
| HTTP 클라이언트 | Axios |
| DNS 조회 | `dns/promises` (Node 내장) |
| TLS/SSL 조회 | `tls` (Node 내장) |
| HTML 파싱 | Cheerio |
| 보안 | Helmet, CORS |
| 입력 검증 | Zod |
| Rate Limit | express-rate-limit |

## 프로젝트 구조

```
utility-api/
 ├── api/
 │   └── index.ts          # Vercel Serverless Function 진입점
 ├── src/
 │   ├── app.ts             # Express 앱 팩토리 (createApp)
 │   ├── local.ts           # 로컬 개발용 진입점 (app.listen)
 │   ├── config/
 │   │   └── env.ts         # 환경변수 로딩/파싱
 │   ├── routes/            # 라우트 정의 (서비스 호출만 수행)
 │   ├── services/          # 실제 비즈니스 로직
 │   ├── middleware/         # helmet/cors 외 커스텀 미들웨어
 │   ├── utils/              # 공통 유틸 (응답 포맷, 검증, 에러 클래스)
 │   └── types/               # 공통 타입 정의
 ├── vercel.json
 ├── package.json
 ├── tsconfig.json
 ├── .eslintrc.json
 ├── .prettierrc
 ├── .env.example
 └── postman_collection.json
```

## 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env

# 3. 개발 서버 실행 (파일 변경 감지)
npm run dev

# 4. 프로덕션 빌드 및 실행
npm run build
npm start

# 5. 타입 체크 / 린트 / 포맷
npm run typecheck
npm run lint
npm run format
```

기본적으로 로컬 서버는 `http://localhost:3000` 에서 실행됩니다.

## 환경 변수

`.env.example` 참고:

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `PORT` | 로컬 실행 시 사용할 포트 (Vercel에서는 무시됨) | `3000` |
| `CORS_ORIGIN` | 허용할 Origin, 콤마로 구분. `*`는 전체 허용 | `*` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit 시간 창(ms) | `60000` |
| `RATE_LIMIT_MAX` | 시간 창 내 최대 요청 수 | `60` |
| `REQUEST_TIMEOUT_MS` | 외부 요청(HEAD/GET/TLS) 타임아웃(ms) | `10000` |
| `IP_API_LANG` | ip-api.com 응답 언어 | `en` |

## 공통 응답 포맷

**성공**

```json
{
  "success": true,
  "data": { }
}
```

**실패**

```json
{
  "success": false,
  "error": "설명"
}
```

모든 에러는 전역 에러 핸들러(`src/middleware/errorHandler.ts`)를 거쳐 위 포맷으로 통일되며, 적절한 HTTP 상태 코드(400/404/429/502/504/500 등)와 함께 응답됩니다.

## API 명세

### 1. `GET /url` — URL 온라인 상태 확인

- **Query**: `url` (필수, `http://` 또는 `https://`로 시작해야 함)
- **동작**: HEAD 요청 전송, 리다이렉트 추적, 타임아웃 10초
- **예시**: `GET /url?url=https://example.com`

```json
{
  "success": true,
  "data": {
    "online": true,
    "status": 200,
    "statusText": "OK",
    "responseTime": 82,
    "finalUrl": "https://example.com/",
    "redirects": 1,
    "protocol": "https",
    "hostname": "example.com"
  }
}
```

### 2. `GET /ip` — IP 정보 조회

- **Query**: `ip` (필수, IPv4 또는 IPv6)
- **동작**: [ip-api.com](https://ip-api.com) 무료 API 호출
- **예시**: `GET /ip?ip=8.8.8.8`

```json
{
  "success": true,
  "data": {
    "ip": "8.8.8.8",
    "country": "United States",
    "countryCode": "US",
    "region": "VA",
    "regionName": "Virginia",
    "city": "Ashburn",
    "isp": "Google LLC",
    "org": "Google Public DNS",
    "as": "AS15169 Google LLC",
    "lat": 39.03,
    "lon": -77.5,
    "timezone": "America/New_York",
    "proxy": false,
    "hosting": true
  }
}
```

### 3. `GET /dns` — DNS 레코드 조회

- **Query**: `domain` (필수)
- **동작**: `dns/promises`로 A, AAAA, MX, NS, TXT, CNAME 레코드 조회 (레코드가 없는 타입은 빈 배열)
- **예시**: `GET /dns?domain=google.com`

```json
{
  "success": true,
  "data": {
    "domain": "google.com",
    "A": ["142.250.206.14"],
    "AAAA": ["2607:f8b0:4005:80a::200e"],
    "MX": [{ "exchange": "smtp.google.com", "priority": 10 }],
    "NS": ["ns1.google.com", "ns2.google.com"],
    "TXT": [["v=spf1 include:_spf.google.com ~all"]],
    "CNAME": []
  }
}
```

### 4. `GET /ssl` — SSL 인증서 조회

- **Query**: `domain` (필수)
- **동작**: 443 포트로 TLS 연결하여 피어 인증서 조회
- **예시**: `GET /ssl?domain=google.com`

```json
{
  "success": true,
  "data": {
    "domain": "google.com",
    "issuer": "C=US, O=Google Trust Services, CN=WR2",
    "subject": "CN=google.com",
    "validFrom": "2026-06-01T08:00:00.000Z",
    "validTo": "2026-08-24T08:00:00.000Z",
    "daysLeft": 45,
    "valid": true
  }
}
```

### 5. `GET /meta` — 웹페이지 메타데이터 조회

- **Query**: `url` (필수)
- **동작**: HTML을 가져와 Cheerio로 `title`, `description`, `favicon`, Open Graph 태그 추출
- **예시**: `GET /meta?url=https://example.com`

```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "title": "Example Domain",
    "description": null,
    "favicon": "https://example.com/favicon.ico",
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null
  }
}
```

### 6. `GET /http-status` — HTTP 상태 코드 설명

- **Query**: `code` (필수, 100~599)
- **예시**: `GET /http-status?code=404`

```json
{
  "success": true,
  "data": {
    "code": 404,
    "message": "Not Found",
    "description": "요청한 리소스를 찾을 수 없습니다."
  }
}
```

## Vercel 배포

1. GitHub에 리포지토리를 push 합니다.
2. [Vercel](https://vercel.com)에서 New Project → 해당 리포지토리 선택
3. Framework Preset은 **Other**로 두고, Build Command는 비워둡니다 (`vercel.json`에 설정되어 있음).
4. Vercel 프로젝트 설정의 Environment Variables에 `.env.example`의 항목들을 등록합니다.
5. Deploy 후, 아래와 같이 호출합니다.

```
https://<your-project>.vercel.app/url?url=https://google.com
https://<your-project>.vercel.app/ip?ip=8.8.8.8
https://<your-project>.vercel.app/dns?domain=google.com
https://<your-project>.vercel.app/ssl?domain=google.com
https://<your-project>.vercel.app/meta?url=https://google.com
https://<your-project>.vercel.app/http-status?code=404
```

`vercel.json`은 모든 요청을 `api/index.ts`(Express 앱)로 라우팅하도록 `rewrites`를 설정해두었습니다. Express 라우터가 실제 경로 매칭을 담당하므로, 새로운 엔드포인트를 추가해도 `vercel.json`을 수정할 필요가 없습니다.

## 새로운 API 추가하는 법

1. `src/services/`에 순수 로직 함수를 작성합니다. (예: `weatherService.ts`)
2. `src/types/index.ts`에 결과 타입을 추가합니다.
3. 필요하다면 `src/utils/validators.ts`에 Zod 쿼리 스키마를 추가합니다.
4. `src/routes/`에 라우트 파일을 만들고, `asyncHandler`로 감싼 핸들러에서 서비스 함수를 호출합니다.
5. `src/routes/index.ts`에 `router.use('/새경로', 새라우터)` 한 줄만 추가합니다.

라우트는 서비스를 호출하고 응답을 내려주는 역할만 하며, 실제 로직/에러 처리는 서비스 계층에서 담당합니다.

## Postman Collection

`postman_collection.json` 파일을 Postman에 Import 하면 6개 API에 대한 요청 예시가 모두 포함되어 있습니다. Collection 변수 `baseUrl`을 로컬(`http://localhost:3000`) 또는 배포된 Vercel URL로 바꿔서 사용하세요.

## Discord 봇 연동 예시

```ts
import axios from 'axios';

const BASE_URL = 'https://<your-project>.vercel.app';

async function checkUrl(url: string) {
  const { data } = await axios.get(`${BASE_URL}/url`, { params: { url } });
  return data;
}
```

## 라이선스

내부/개인 프로젝트 용도로 자유롭게 사용하세요.
