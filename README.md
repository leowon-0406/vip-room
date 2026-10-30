# VIP ROOM

비공식 BIGBANG 팬 아카이브이자, 개인 보유 음원을 브라우저에서 관리·재생하는 비공개 공간입니다. 공식 사이트나 권리자를 사칭하지 않으며, 저작권이 있는 음원·가사는 무단 배포하지 않습니다.

## 현재 구현: Phase 1–2

- Next.js 16 + TypeScript strict + Tailwind 기반 반응형 다크 UI
- 데스크톱 사이드바, 모바일 내비게이션, 전역 플레이어 상태 기반
- 홈 대시보드, 섹션 라우팅, 상태 확인 API (`/api/health`)
- Supabase 환경변수 안전한 선택적 초기화
- Profiles, 초대, 설정, 곡·앨범 카탈로그, 개인 음원 연결 메타데이터의 SQL/RLS 기반
- IndexedDB 기반 개인 음원 파일 보관, 태그/파일명 정보 추출, 중복 감지
- 다중 파일 선택·드래그 앤 드롭, HTML5 Audio 실제 재생, 대기열·이전/다음·셔플·반복·볼륨

## 로컬 실행

1. `.env.example`을 복사해 `.env.local`을 만들고 Supabase 값을 넣습니다. 값이 없어도 UI와 상태 API는 동작합니다.
2. Supabase SQL Editor에서 `supabase/migrations/20261030_phase1_foundation.sql`을 실행합니다.
3. `npm run dev`를 실행하고 `http://localhost:3000`을 엽니다.

## 다음 단계

Phase 3에서 TXT/LRC 가사 등록과 동기화 표시를 구현합니다. 공식 곡 카탈로그·곡 자동 매칭은 검증된 데이터 수집 이후 추가합니다.

## 배포

Render 또는 Vercel에 저장소를 연결한 뒤 `.env.local`의 공개 Supabase 변수만 프로젝트 환경변수로 추가합니다. `SUPABASE_SERVICE_ROLE_KEY`와 `OPENAI_API_KEY`는 서버 전용 Route Handler/Server Action에서만 사용하며 브라우저로 노출하지 않습니다.
