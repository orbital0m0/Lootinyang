# Plan: 로그인 제거 & 로컬 저장 모드

## 1. 개요

| 항목 | 내용 |
|------|------|
| Feature | local-storage-mode |
| 작성일 | 2026-02-22 |
| 우선순위 | High |
| 예상 범위 | 인증 시스템 전체 제거, Supabase 데이터 레이어 → localStorage 교체, 백업 코드 시스템 신규 구현 |

### 배경 및 목적

현재 앱은 Supabase 인증을 통해 로그인해야만 사용 가능하다.
사용자 진입 장벽을 낮추고 서버 의존성을 제거하기 위해 다음과 같이 전환한다:

- **로그인 제거**: 가입/로그인 없이 앱을 바로 사용
- **로컬 저장**: 모든 데이터를 `localStorage`에 저장
- **데이터 경고**: 브라우저 캐시 삭제 시 데이터 손실 고지
- **백업 코드**: 사용자가 데이터를 내보내고 복원할 수 있는 개인 백업 코드 제공

---

## 2. 현재 구현 상태 분석

### 제거 대상

| 항목 | 파일 | 내용 |
|------|------|------|
| 인증 페이지 | `src/pages/Auth.tsx` | 전체 제거 |
| Supabase 클라이언트 | `src/services/supabase.ts` | 데이터 CRUD 함수 전체 교체 (supabase 클라이언트 제거) |
| Google OAuth | `src/components/auth/ForgotPasswordModal.tsx` | 제거 |
| 라우팅 가드 | `src/App.tsx`, 각 페이지 `useEffect` | auth 체크 제거 |
| Supabase 패키지 의존성 | `package.json` | `@supabase/supabase-js` 제거 |

### 교체 대상 (Supabase → localStorage)

| 훅 | 현재 | 교체 방향 |
|----|------|-----------|
| `useUser.ts` | Supabase `users` 테이블 | `localStorage['lootinyang_user']` |
| `useHabits.ts` | Supabase `habits` 테이블 | `localStorage['lootinyang_habits']` |
| `useDailyChecks.ts` | Supabase `daily_checks` 테이블 | `localStorage['lootinyang_daily_checks']` |
| `useAchievements.ts` | Supabase `achievements` + `user_achievements` | 정적 ACHIEVEMENTS_DATA + `localStorage['lootinyang_user_achievements']` |
| `useItems.ts` | Supabase `user_items` 테이블 | `localStorage['lootinyang_user_items']` |
| `useRewards.ts` | Supabase `reward_boxes` 테이블 | `localStorage['lootinyang_reward_boxes']` |

### 신규 구현 대상

| 항목 | 파일 | 내용 |
|------|------|------|
| 로컬 저장소 서비스 | `src/services/localStore.ts` | localStorage CRUD 추상화 레이어 |
| 백업 훅 | `src/hooks/useBackup.ts` | 데이터 내보내기/가져오기 로직 |
| 백업 모달 | `src/components/BackupModal.tsx` | 백업 코드 표시 및 복원 UI |
| 데이터 경고 배너 | `src/components/DataWarningBanner.tsx` | 첫 방문 시 데이터 손실 경고 |
| 온보딩 화면 | `src/pages/Onboarding.tsx` | Auth 대신 앱 시작 화면 (닉네임 설정) |

---

## 3. 구현 계획

### Phase A: 데이터 레이어 교체

#### A-1. 로컬 저장소 서비스 (`src/services/localStore.ts`)

localStorage를 JSON 직렬화/역직렬화로 감싸는 CRUD 추상화 레이어.

```
localStore.get<T>(key): T | null
localStore.set<T>(key, value: T): void
localStore.update<T>(key, updater: (prev: T) => T): void
localStore.remove(key): void
localStore.clear(): void
```

저장 키 목록:
- `lootinyang_user` - 사용자 프로필 (id, username, level, exp, streak, ...)
- `lootinyang_habits` - 습관 배열
- `lootinyang_daily_checks` - 일일 체크 배열
- `lootinyang_user_achievements` - 달성 업적 ID 배열
- `lootinyang_user_items` - 보유 아이템 배열
- `lootinyang_reward_boxes` - 보상 상자 배열
- `lootinyang_onboarded` - 온보딩 완료 여부 (boolean)
- `lootinyang_warned` - 데이터 경고 확인 여부 (boolean)

#### A-2. 훅별 교체

각 훅의 Supabase 호출을 localStore 호출로 1:1 교체.
TanStack Query의 `queryFn`을 localStore 읽기로, mutation의 `mutationFn`을 localStore 쓰기로 교체.
쿼리 키 및 invalidation 체계는 유지.

#### A-3. 정적 데이터 처리

- `items` 테이블 → `ITEMS_DATA` (이미 `constants.ts`에 존재)
- `achievements` 테이블 → `ACHIEVEMENTS_DATA` (이미 `constants.ts`에 존재)
- 두 테이블은 읽기 전용이므로 로컬 저장 불필요

### Phase B: 인증 제거 & 온보딩

#### B-1. Auth 페이지 → 온보딩 페이지

- `src/pages/Auth.tsx` 삭제
- `src/pages/Onboarding.tsx` 신규 생성
  - 닉네임 입력 (선택, 건너뛰기 가능)
  - 데이터 손실 경고 안내
  - 기존 백업 코드 복원 옵션
  - "시작하기" 버튼 → 메인 홈으로 이동

#### B-2. 라우팅 정리

- `/auth` 라우트 → `/onboarding` 라우트로 교체
- 모든 페이지의 `if (!user) navigate('/auth')` 제거
- 온보딩 완료 여부(`lootinyang_onboarded`)만 체크

#### B-3. userId 처리

- `crypto.randomUUID()` 또는 `Date.now().toString(36)` 으로 로컬 UUID 생성
- 첫 방문 시 생성, `lootinyang_user`에 저장

### Phase C: 백업 코드 시스템

#### C-1. 백업 코드 생성

전체 앱 데이터를 JSON으로 직렬화 → Base64 인코딩 → 백업 코드 생성.

```
{
  version: "1.0",
  exportedAt: ISO8601,
  data: {
    user, habits, daily_checks,
    user_achievements, user_items, reward_boxes
  }
}
→ JSON.stringify → btoa() → 백업 코드 문자열
```

백업 코드는 "LOOT-" 접두사 + Base64 문자열로 구성.

#### C-2. 백업 코드 복원

- 백업 코드 입력 → atob() 디코딩 → JSON.parse → 검증 → localStore 전체 덮어쓰기

#### C-3. BackupModal 컴포넌트

- 프로필 페이지 또는 설정에서 접근 가능
- 탭 구성:
  - **내보내기 탭**: 백업 코드 표시 + 복사 버튼 + 파일 다운로드 버튼
  - **가져오기 탭**: 백업 코드 입력 텍스트 에어리어 + 복원 버튼

### Phase D: 데이터 경고 UI

#### D-1. 데이터 경고 배너

- 첫 방문 시 또는 `lootinyang_warned`가 false일 때 표시
- 내용: "이 앱은 데이터를 브라우저에 저장합니다. 브라우저 캐시를 삭제하면 데이터가 사라집니다. 백업 코드로 데이터를 보관하세요."
- "확인했어요" 버튼 클릭 시 배너 숨김 + `lootinyang_warned = true` 저장

#### D-2. 프로필 페이지 백업 버튼

- 프로필 설정 탭에 "데이터 백업/복원" 섹션 추가
- 항상 접근 가능한 백업 코드 생성 버튼

---

## 4. 구현 우선순위 및 의존성

```
Phase A (데이터 레이어) ← 최우선, 모든 것의 기반
  A-1 localStore 서비스
  A-2 훅별 교체 ← A-1에 의존
  A-3 정적 데이터 처리 ← A-2와 함께

Phase B (인증 제거) ← Phase A 완료 후
  B-1 온보딩 페이지
  B-2 라우팅 정리 ← B-1에 의존
  B-3 userId 로컬 생성 ← A-1에 의존

Phase C (백업 시스템) ← Phase A, B 완료 후
  C-1 백업 코드 생성/복원 로직
  C-2 BackupModal UI ← C-1에 의존

Phase D (경고 UI) ← Phase B 완료 후
  D-1 데이터 경고 배너
  D-2 프로필 백업 버튼 ← C-2에 의존
```

---

## 5. 기술적 고려사항

### localStorage 용량

- 브라우저 `localStorage` 한도: 도메인당 5~10MB
- 습관/체크 데이터는 텍스트 기반이므로 수년 사용해도 수 MB 이내 예상
- 필요 시 오래된 `daily_checks` 자동 정리 (90일 이상 오래된 것 제거)

### TanStack Query 연동

- 기존 쿼리 키/invalidation 체계 유지
- `queryFn`이 `localStorage`를 읽고, mutation이 쓰는 방식
- 서버 상태 → 클라이언트 상태로 전환되지만 Query 캐싱 레이어는 유지
- `staleTime: Infinity`로 설정하면 불필요한 리페치 방지

### Supabase 패키지 제거

- `@supabase/supabase-js` 제거 → 번들 사이즈 168KB(gzip 44KB) 감소
- `.env` 파일의 Supabase 관련 환경 변수 제거
- CI/CD의 `SUPABASE_URL`, `SUPABASE_ANON_KEY` secrets 불필요

### 백업 코드 보안

- Base64 인코딩은 암호화가 아님 → 백업 코드 노출 시 데이터 복호화 가능
- 사용자에게 백업 코드를 안전하게 보관하도록 안내
- 추후 선택적으로 비밀번호 기반 AES 암호화 추가 가능

---

## 6. 수정이 필요한 기존 파일

| 파일 | 수정 내용 |
|------|-----------|
| `src/App.tsx` | auth 라우트 제거, 온보딩 라우트 추가, ToastProvider 유지 |
| `src/services/supabase.ts` | 전체 삭제 후 `localStore.ts`로 대체 |
| `src/hooks/useUser.ts` | localStorage 기반으로 재작성 |
| `src/hooks/useHabits.ts` | localStorage 기반으로 재작성 |
| `src/hooks/useDailyChecks.ts` | localStorage 기반으로 재작성 |
| `src/hooks/useAchievements.ts` | localStorage + 정적 데이터 기반으로 재작성 |
| `src/hooks/useItems.ts` | localStorage 기반으로 재작성 |
| `src/hooks/useRewards.ts` | localStorage 기반으로 재작성 |
| `src/hooks/useGameEvents.ts` | userId 참조 방식 변경 (auth → localStore) |
| `src/pages/Home.tsx` | auth 가드 제거 |
| `src/pages/Profile.tsx` | 백업 버튼 추가, 로그아웃 버튼 제거 |
| `package.json` | `@supabase/supabase-js` 제거 |

---

## 7. 신규 파일

| 파일 | 용도 |
|------|------|
| `src/services/localStore.ts` | localStorage CRUD 추상화 |
| `src/hooks/useBackup.ts` | 백업 코드 생성/복원 훅 |
| `src/components/BackupModal.tsx` | 백업/복원 UI 모달 |
| `src/components/DataWarningBanner.tsx` | 데이터 손실 경고 배너 |
| `src/pages/Onboarding.tsx` | 최초 진입 온보딩 화면 |

---

## 8. 제거 대상 파일

| 파일 | 이유 |
|------|------|
| `src/pages/Auth.tsx` | 로그인 기능 제거 |
| `src/components/auth/ForgotPasswordModal.tsx` | 로그인 기능 제거 |
| `src/components/auth/` (디렉토리) | 로그인 기능 제거 |

---

## 9. 리스크 및 대안

| 리스크 | 영향 | 대안 |
|--------|------|------|
| 기존 Supabase 사용자 데이터 손실 | 현재 DB가 비어있어 영향 없음 | 마이그레이션 스크립트 제공 |
| localStorage 5MB 한도 초과 | 장기 사용 시 쓰기 실패 | daily_checks 90일 초과분 자동 정리 |
| 백업 코드 분실 | 데이터 복원 불가 | 데이터 경고 UI에서 정기 백업 권고 |
| 멀티 디바이스 동기화 불가 | 기기 변경 시 백업 코드 필요 | 백업 코드 가져오기로 해결 |
| Safari Private Mode localStorage 제한 | 데이터 저장 불가 | sessionStorage 폴백 또는 경고 표시 |
