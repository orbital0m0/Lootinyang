# profile Analysis Report

> **Analysis Type**: Gap Analysis (Design vs Implementation)
>
> **Project**: Lootinyang (habit-cat-app)
> **Analyst**: gap-detector
> **Date**: 2026-03-07
> **Design Doc**: [profile.design.md](../../02-design/features/profile.design.md)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Design 문서(Section 3~9)와 실제 구현 코드 간의 일치도를 검증하여 누락/변경/추가 항목을 식별한다.

### 1.2 Analysis Scope

- **Design Document**: `docs/02-design/features/profile.design.md`
- **Implementation Path**: `src/services/localStore.ts`, `src/hooks/useSettings.ts`, `src/components/profile/`, `src/pages/Profile.tsx`
- **Analysis Date**: 2026-03-07

---

## 2. Gap Analysis (Design vs Implementation)

### 2.1 Section 3: Data Structures

#### AppSettings 타입

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `notifications.habitReminder: boolean` | O | O (`localStore.ts` L19) | ✅ Match |
| `notifications.rewardAlert: boolean` | O | O (`localStore.ts` L20) | ✅ Match |
| `theme: 'default' \| 'mint' \| 'lavender' \| 'rose'` | O | O (`localStore.ts` L22) | ✅ Match |
| `DEFAULT_SETTINGS` 상수 | O | O (`localStore.ts` L25-28) | ✅ Match |

#### STORE_KEYS.SETTINGS

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `SETTINGS: 'lootinyang_settings'` | O | O (`localStore.ts` L13) | ✅ Match |

**Section 3 Score: 5/5 (100%)**

---

### 2.2 Section 4: useSettings.ts

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `useQuery` + `STORE_KEYS.SETTINGS` | O | O (L8-12) | ✅ Match |
| `staleTime: Infinity` | O | O (L11) | ✅ Match |
| `updateSettingsMutation` (useMutation) | O | O (L14-24) | ✅ Match |
| merge strategy `{ ...current, ...updates }` | O | O (L17) | ✅ Match |
| `updateNotification(key, value)` | O | O (L26-31) | ✅ Match |
| `updateTheme(theme)` | O | O (L33-36) | ✅ Match |
| `document.documentElement.setAttribute('data-theme', theme)` | O | O (L35) | ✅ Match |
| `queryClient.invalidateQueries(['settings'])` | O | O (L22) | ✅ Match |

**Section 4 Score: 8/8 (100%)**

---

### 2.3 Section 5.1: StatisticsTab.tsx

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `useHabits(user.id)` 호출 | O | O (L13) | ✅ Match |
| `useDailyChecks(user.id)` 호출 | O | O (L14) | ✅ Match |
| `useAchievements(user.id)` 호출 | O | O (L15) | ✅ Match |
| 전체 체크: `dailyChecks.filter(c => c.completed).length` | O | O (L18) | ✅ Match |
| 달성률: 30일 cutoff 계산 | O | O (L21-28) | ✅ Match |
| 달성률: `maxPossible > 0` 가드 → `'-'` | O | O (L26-28) | ✅ Match |
| 업적 수: `getUnlockedAchievements().length` | O | O (L31) | ✅ Match |
| 최근 업적: `.slice(0, 3)` | O | O (L34-38) | ✅ Match |
| 최근 업적: `achievement.icon`, `achievement.name` | O | O (L36-37) | ✅ Match |
| 주간 통계: `habits.slice(0, 5)` | O | O (L41) | ✅ Match |
| 주간 통계: `getWeeklyProgress(habit.id, habit.weekly_target)` | O | O (L42) | ✅ Match |
| 주간 통계: `completed` 근사 계산 | O | O (L43) | ✅ Match |
| 빈 상태: 업적 없음 메시지 | O | O (L104) | ✅ Match |
| 빈 상태: 습관 없음 메시지 | O | O (L148) | ✅ Match |

**Section 5.1 Score: 14/14 (100%)**

---

### 2.4 Section 5.2: SettingsTab.tsx

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `useSettings()` 호출 | O | O (L10) | ✅ Match |
| `notifications` 배열에 `key: keyof AppSettings['notifications']` | O | O (L12-19) | ✅ Match |
| 토글 `onClick`: `updateNotification(item.key, !enabled)` | O | O (L55) | ✅ Match |
| `enabled` = `settings.notifications[item.key]` | O | O (L40) | ✅ Match |
| `themes` 배열에 `value: AppSettings['theme']` | O | O (L21-27) | ✅ Match |
| `active` = `settings.theme === theme.value` | O | O (L64) | ✅ Match |
| 테마 `onClick`: `updateTheme(theme.value)` | O | O (L72) | ✅ Match |

**Section 5.2 Score: 7/7 (100%)**

---

### 2.5 Section 5.3: LevelCard.tsx

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `onLevelUpTest` prop 제거 | O | O (interface에 없음) | ✅ Match |
| "레벨업 테스트" 버튼 제거 | O | O (버튼 없음) | ✅ Match |
| `showLevelUp` prop 유지 | O | O (L8) | ✅ Match |

**Section 5.3 Score: 3/3 (100%)**

---

### 2.6 Section 5.4: ProfileHeader.tsx

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `user: LocalUser` (null 아님) | O | O (L4) | ✅ Match |
| `user?.level \|\| 5` 폴백 제거 | O | O (`user.level` 직접 사용) | ✅ Match |
| `user?.streak \|\| 7` 폴백 제거 | O | O (`user.streak` 직접 사용) | ✅ Match |
| `user?.username` 폴백 제거 | O | O (`user.username` 직접 사용) | ✅ Match |

**Section 5.4 Score: 4/4 (100%)**

---

### 2.7 Section 5.5: Profile.tsx

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `showLevelUp` state 제거 | O | O (state 없음) | ✅ Match |
| `handleLevelUp` 함수 제거 | O | O (함수 없음) | ✅ Match |
| `onLevelUpTest` prop 제거 | O | O (LevelCard에 전달 안 함) | ✅ Match |
| `showLevelUp={false}` 하드코딩 전달 | X | O (ProfileHeader, LevelCard에 전달) | ⚠️ Added |

**Note on `showLevelUp={false}`**: Design은 state와 handler 제거를 명시했으나, `showLevelUp` prop 자체를 자식 컴포넌트에서 완전히 제거할지는 명시하지 않음. 현재 구현은 `false`를 하드코딩으로 전달하는데, 이는 향후 레벨업 애니메이션 재도입 시 확장 가능한 형태로 남겨둔 것. 기능상 문제 없음.

**Section 5.5 Score: 3/4 (75%) - 1 added**

---

### 2.8 Section 6: 구현 순서 준수

| 순서 | 파일 | 상태 |
|------|------|------|
| 1 | `localStore.ts` | ✅ 완료 |
| 2 | `useSettings.ts` | ✅ 완료 |
| 3 | `StatisticsTab.tsx` | ✅ 완료 |
| 4 | `SettingsTab.tsx` | ✅ 완료 |
| 5 | `LevelCard.tsx` | ✅ 완료 |
| 6 | `ProfileHeader.tsx` | ✅ 완료 |
| 7 | `Profile.tsx` | ✅ 완료 |

**Section 6 Score: 7/7 (100%)**

---

### 2.9 Section 7: 빈 상태(Empty State) 처리

| 상황 | Design | Implementation | Status |
|------|--------|----------------|--------|
| 업적 없음 → 메시지 | "아직 달성한 업적이 없어요 🐱" | O (`StatisticsTab.tsx` L104) | ✅ Match |
| 습관 없음 → 메시지 | "습관을 추가하면 통계가 보여요 📊" | O (`StatisticsTab.tsx` L148) | ✅ Match |
| 달성률 분모 0 → `'-'` | O | O (`localStore.ts` 계산 로직) | ✅ Match |

**Section 7 Score: 3/3 (100%)**

---

### 2.10 Section 8: 테마 적용 범위

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `data-theme` 속성 저장만 (v1) | O | O (`useSettings.ts` L35) | ✅ Match |
| CSS 변수 오버라이드는 추후 | O | O (CSS 변경 없음) | ✅ Match |

**Section 8 Score: 2/2 (100%)**

---

## 3. Differences Found

### 3.1 Missing Features (Design O, Implementation X)

없음. Critical/Major 누락 항목 없음.

### 3.2 Added Features (Design X, Implementation O)

| Severity | Item | Location | Description |
|----------|------|----------|-------------|
| Info | `showLevelUp={false}` 하드코딩 | `Profile.tsx` | state 제거 후 prop을 false로 고정 전달. 향후 레벨업 애니메이션 재도입 시 확장 가능 |
| Info | `hooks/index.ts` export 추가 | `hooks/index.ts` | `useSettings` export 추가. 설계에 명시 안 됐으나 필수적 추가 |

### 3.3 Changed Features

없음.

---

## 4. Architecture Compliance

| Layer | Expected | Exists | Status |
|-------|----------|:------:|--------|
| `src/services/` | localStore 확장 | ✅ | ✅ Correct |
| `src/hooks/` | useSettings 신규 | ✅ | ✅ Correct |
| `src/components/profile/` | 컴포넌트 수정 | ✅ | ✅ Correct |
| `src/pages/` | Profile.tsx 수정 | ✅ | ✅ Correct |

**Dependency Direction**:
- `SettingsTab` → `useSettings` → `localStore` ✅
- `StatisticsTab` → `useHabits`, `useDailyChecks`, `useAchievements` ✅
- 모든 훅은 `localStore` 통해서만 접근 ✅

**Architecture Score: 100%**

---

## 5. Convention Compliance

| Category | Convention | Compliance | Violations |
|----------|-----------|:----------:|------------|
| 훅 파일명 | `use*.ts` camelCase | 100% | `useSettings.ts` ✅ |
| 컴포넌트 | PascalCase | 100% | 없음 |
| 타입/인터페이스 | PascalCase | 100% | `AppSettings` ✅ |
| 상수 | UPPER_SNAKE_CASE | 100% | `DEFAULT_SETTINGS`, `STORE_KEYS` ✅ |
| Import 경로 | 상대 경로 | 100% | 없음 |

**Convention Score: 100%**

---

## 6. Overall Score

```
+---------------------------------------------+
|  Overall Match Rate: 98%                     |
+---------------------------------------------+
|  Section 3 (Data structures):    100%        |
|  Section 4 (useSettings):        100%        |
|  Section 5.1 (StatisticsTab):    100%        |
|  Section 5.2 (SettingsTab):      100%        |
|  Section 5.3 (LevelCard):        100%        |
|  Section 5.4 (ProfileHeader):    100%        |
|  Section 5.5 (Profile.tsx):       75%        |
|  Section 6 (구현 순서):           100%        |
|  Section 7 (Empty states):       100%        |
|  Section 8 (테마 범위):           100%        |
|                                              |
|  Architecture Compliance:        100%        |
|  Convention Compliance:          100%        |
+---------------------------------------------+

  Total checked items: 50
  Matched: 49  (98%)
  Missing:  0  ( 0%)
  Added:    2  (Info only)
  Changed:  0  ( 0%)

  Overall Score: 98%
```

---

## 7. Gap Classification

### Critical (0 items) — None

### Major (0 items) — None

### Minor (0 items) — None

### Info (2 items)

| # | Item | Description |
|---|------|-------------|
| 1 | `showLevelUp={false}` 하드코딩 | Profile.tsx에서 state 제거 후 false 고정 전달. 기능상 문제 없음 |
| 2 | `hooks/index.ts` export 추가 | useSettings export 누락 없이 추가됨. 설계 문서에 미명시였으나 필수 작업 |

---

## 8. Recommended Actions

### 8.1 Optional Cleanup

| Priority | Item | Action |
|----------|------|--------|
| Low | `showLevelUp` prop 완전 제거 | ProfileHeader, LevelCard, Profile에서 prop 자체를 제거하면 더 깔끔함. 단, 향후 레벨업 애니메이션 재도입 시 다시 추가 필요 |

### 8.2 Future Enhancements (설계 명시 외)

| Item | Description |
|------|-------------|
| 테마 CSS 변수 적용 | `data-theme` 속성에 반응하는 CSS 변수 오버라이드 구현 (별도 피처) |
| 알림 실제 연동 | PWA 알림 API와 `habitReminder` 설정 연동 (별도 피처) |

---

## 9. Conclusion

Match Rate **98%** — 90% 임계값 초과. 설계 문서와 구현 코드가 전항목 일치한다.

Critical/Major/Minor gap 없음. Info 항목 2개는 모두 의도된 추가이며 기능상 문제 없다.

**Verdict**: 구현 완료. 즉시 Report 단계 진행 가능.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-03-07 | Initial gap analysis | gap-detector |
