# VIP ROOM

비공식 BIGBANG 팬 아카이브이자, 개인 보유 음원을 브라우저에서 관리·재생하는 비공개 공간입니다. 공식 사이트나 권리자를 사칭하지 않으며, 저작권이 있는 음원·가사는 무단 배포하지 않습니다.

## 현재 구현: Phase 1

- Next.js 16 + TypeScript strict + Tailwind 기반 반응형 다크 UI
- 데스크톱 사이드바, 모바일 내비게이션, 전역 플레이어 상태 기반
- 홈 대시보드, 섹션 라우팅, 상태 확인 API (`/api/health`)
- Supabase 환경변수 안전한 선택적 초기화
- Profiles, 초대, 설정, 곡·앨범 카탈로그, 개인 음원 연결 메타데이터의 SQL/RLS 기반

## 로컬 실행

1. `.env.example`을 복사해 `.env.local`을 만들고 Supabase 값을 넣습니다. 값이 없어도 UI와 상태 API는 동작합니다.
2. Supabase SQL Editor에서 `supabase/migrations/20261030_phase1_foundation.sql`을 실행합니다.
3. `npm run dev`를 실행하고 `http://localhost:3000`을 엽니다.

## 다음 단계

Phase 2에서 IndexedDB 기반 다중 음원 가져오기, 메타데이터 추출/곡 매칭, 실제 HTML5 Audio 재생, 카탈로그 상세와 즐겨찾기를 구현합니다.

## 배포

Vercel에 저장소를 연결한 뒤 `.env.local`의 공개 Supabase 변수만 프로젝트 환경변수로 추가합니다. `SUPABASE_SERVICE_ROLE_KEY`와 `OPENAI_API_KEY`는 서버 전용 Route Handler/Server Action에서만 사용하며 브라우저로 노출하지 않습니다.
