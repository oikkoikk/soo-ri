# 수리수리 마수리 (Soo-Ri)

![수리수리 마수리 배너 이미지](/docs/public/open-graph.png)

## 전동보장구 수리 이력 통합 관리 시스템

### 프로젝트 소개

**수리수리 마수리**는 전동보장구(전동휠체어, 전동스쿠터 등)의 수리 이력을 통합적으로 관리하는 시스템입니다.  
장애인 사용자와 장애인 수리기사를 연결하는 **value-chain**을 구축하여, 전동보장구 수리 과정을 디지털화합니다.

본 프로젝트는 **카카오임팩트 재단의 테크포임팩트 캠퍼스**의 일환으로 개발되었으며,  
**성동장애인종합복지관**과 협력하여 진행되었습니다.

### 주요 기능

- **QR 코드 기반 전동보장구 식별**  
  전동보장구마다 고유 QR 코드를 부착하여 정확한 식별 가능

- **수리기사 전용 기록 인터페이스**  
  장애인 수리기사가 쉽게 수리 이력을 기록할 수 있는 접근성 높은 UI 제공

- **수리 이력 자동 저장**  
  모든 수리 요청 및 이력을 데이터베이스에 자동 저장

- **복지관 관계자용 대시보드**  
  전체 수리 요청 및 완료 상태 등을 실시간 통계로 제공

- **통합 데이터 관리**  
  분산된 데이터를 통합 관리하여 전체 수리 이력 체계화

### 가치 사슬 (Value Chain)

전동보장구 수리 프로세스를 디지털화하여 다음과 같은 가치 사슬을 형성합니다:

1. **장애인 사용자**
   - 전동보장구 수리 요청 및 이력 확인
2. **장애인 수리기사**
   - 수리 이력 기록 및 관리
3. **복지관 담당자**
   - 전체 수리 현황 모니터링 및 자원 배분
4. **정책 입안자**
   - 실제 데이터 기반 정책 수립 지원

### 기술 스택

- **프론트엔드**: React 19, TypeScript
- **상태 관리**: Jotai
- **라우팅**: React Router
- **스타일링**: Emotion
- **빌드 도구**: Vite, SWC
- **패키지 매니저**: pnpm
- **코드 품질**: ESLint, Prettier
- **Git Hooks**: Husky
- **사용하지 않는 코드 분석**: Knip

### 프로젝트 구조

본 프로젝트는 **Clean Architecture** 원칙을 기반으로 한 계층형 구조를 따릅니다.

```bash
src/
  ├── application/             # 애플리케이션 로직
  │   ├── apps/                # 애플리케이션 진입점
  │   └── routers/             # 라우팅 설정
  │
  ├── domain/                  # 도메인 모델
  │   └── models/              # Model
  │
  ├── presentation/            # UI 컴포넌트
  │   ├── components/          # 재사용 가능한 컴포넌트
  │   └── pages/               # 페이지 컴포넌트
  │
  └── theme/                   # 테마 및 스타일 관련 설정
      ├── fonts/               # 폰트 설정
      └── styles/              # 글로벌 스타일
```

## 설치 및 실행 방법

### 요구사항

- Node.js v22.14.0 이상 (`.nvmrc` 파일 참고)
- pnpm v9.15.3 이상

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

### 프로덕션 빌드

```bash
pnpm build
```

## 품질 관리

### 타입 체크

```bash
pnpm typecheck
pnpm ci:type
```

### 코드 린팅

```bash
pnpm lint
pnpm ci:lint
```

### 코드 포맷팅

```bash
pnpm format        # 자동 수정
pnpm format:check  # 확인만
pnpm ci:format     # CI 환경 포맷 확인
```

### 미사용 코드 분석

```bash
pnpm knip
pnpm ci:knip
```

### 모든 검사 실행

```bash
pnpm ci:all
```
