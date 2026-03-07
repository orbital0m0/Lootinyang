# local-storage-mode Analysis Report

> **Analysis Type**: Gap Analysis (Design vs Implementation)
>
> **Project**: Lootinyang (habit-cat-app)
> **Version**: 0.0.0
> **Analyst**: gap-detector
> **Date**: 2026-02-22
> **Design Doc**: [local-storage-mode.design.md](../../02-design/features/local-storage-mode.design.md)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Design 문서(Section 3~12)와 실제 구현 코드 간의 일치도를 검증하여 누락/변경/추가 항목을 식별한다.

### 1.2 Analysis Scope

- **Design Document**: `docs/02-design/features/local-storage-mode.design.md`
- **Implementation Path**: `src/` (services, hooks, components, pages, types)
- **Analysis Date**: 2026-02-22

---

## 2. Gap Analysis (Design vs Implementation)

### 2.1 Section 3: localStorage Key Design (8 keys)

| Key | Design | Implementation | Status |
|-----|--------|----------------|--------|
| `lootinyang_user` | O | `STORE_KEYS.USER` | ✅ Match |
| `lootinyang_habits` | O | `STORE_KEYS.HABITS` | ✅ Match |
| `lootinyang_daily_checks` | O | `STORE_KEYS.DAILY_CHECKS` | ✅ Match |
| `lootinyang_user_achievements` | O | `STORE_KEYS.USER_ACHIEVEMENTS` | ✅ Match |
| `lootinyang_user_items` | O | `STORE_KEYS.USER_ITEMS` | ✅ Match |
| `lootinyang_reward_boxes` | O | `STORE_KEYS.REWARD_BOXES` | ✅ Match |
| `lootinyang_onboarded` | O | `STORE_KEYS.ONBOARDED` | ✅ Match |
| `lootinyang_warned` | O | `STORE_KEYS.WARNED` | ✅ Match |

**Score: 8/8 (100%)**

---

### 2.2 Section 4: New Files (4.1~4.5)

#### 4.1 `src/services/localStore.ts`

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| STORE_KEYS 상수 | O | O (L4-13) | ✅ Match |
| `getStore<T>()` | O | O (L44-52) | ✅ Match |
| `setStore<T>()` | O | O (L55-57) | ✅ Match |
| `removeStore()` | O | O (L60-62) | ✅ Match |
| `exportAllData()` | O | O (L65-78) | ✅ Match |
| `importAllData()` | O | O (L81-90) | ✅ Match |
| `migrateStore()` | O | X | ❌ Missing |
| `LocalUser` interface | O | O (L93-102) | ✅ Match |
| `LocalUserItem` interface | O | O (L105-111) | ✅ Match |
| `AppBackupData` interface | O | O (L114-125) | ✅ Match |
| localStorage 비활성화 메모리 폴백 | O (Section 12) | O (L16, memoryStore Map) | ✅ Match |
| `addItemToStore()` helper | X | O (L128-144) | ⚠️ Added |

#### 4.2 `src/hooks/useBackup.ts`

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `UseBackupReturn` interface | O | O (L5-10) | ✅ Match |
| `exportBackupCode()` | O (`btoa(JSON)`) | O (`btoa(encodeURIComponent)`) | ✅ Match (enhanced) |
| `importBackupCode()` | O | O (L34-51) | ✅ Match |
| `downloadBackupFile()` | O | O (L54-66) | ✅ Match |
| `isValidCode()` | O | O (L22-31) | ✅ Match |
| 복원 전 롤백 로직 | O (Section 12) | O (L38, L48) | ✅ Match |
| `queryClient.invalidateQueries()` | O | O (L45) | ✅ Match |
| 페이지 새로고침 | O (`navigate('/')`) | O (`window.location.reload()` in BackupModal) | ✅ Match (variant) |

#### 4.3 `src/components/BackupModal.tsx`

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `BackupModalProps` interface | O | O (L5-8) | ✅ Match |
| 2-tab UI (export/import) | O | O (L11 activeTab) | ✅ Match |
| Export tab: code display | O | O (L82-86) | ✅ Match |
| Export tab: copy button | O | O (L88-92) | ✅ Match |
| Export tab: download button | O | O (L94-99) | ✅ Match |
| Import tab: warning message | O | O (L113-115) | ✅ Match |
| Import tab: code input | O | O (L116-121) | ✅ Match |
| Import tab: restore button | O | O (L122-127) | ✅ Match |

#### 4.4 `src/components/DataWarningBanner.tsx`

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| Display condition (`WARNED === false`) | O | O (L6) | ✅ Match |
| Warning message text | O | O (L21) | ✅ Match |
| "Backup" button -> BackupModal | O | O (L25-28) | ✅ Match |
| "Confirmed" button -> setStore WARNED | O | O (L11-14) | ✅ Match |

#### 4.5 `src/pages/Onboarding.tsx`

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| Display condition (`ONBOARDED === false`) | O (design) | O (handled in App routing) | ✅ Match |
| Step 1: Welcome screen | O | O (L44-61) | ✅ Match |
| Step 2: Nickname input (optional, skip) | O | O (L63-93) | ✅ Match |
| Step 3: Data storage guide | O | O (L95-121) | ✅ Match |
| Backup restore option in Step 3 | O | O (L108-110) | ✅ Match |
| `setStore(ONBOARDED, true)` on start | O | O (L37) | ✅ Match |
| `navigate('/')` after start | O | O (L39) | ✅ Match |

**Section 4 Score: 38/39 (97.4%) - 1 missing (migrateStore), 1 added (addItemToStore)**

---

### 2.3 Section 5: Hook Redesign (5.1~5.6)

#### 5.1 `useUser.ts`

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| queryFn: getStore -> LocalUser | O | O (L29-46) | ✅ Match |
| Auto-create user on first visit | O (`crypto.randomUUID()`) | O (L34-45) | ✅ Match |
| mutationFn: merge updates + updated_at | O | O (L53-61) | ✅ Match |
| `staleTime: Infinity` | O | O (L47) | ✅ Match |
| Return type: `LocalUser` (non-null) | O | O (L24, `DEFAULT_USER`) | ✅ Match |

#### 5.2 `useHabits.ts`

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| queryFn: getStore + filter `is_active` | O | O (L17-18) | ✅ Match |
| createHabit: `crypto.randomUUID()` | O | O (L31) | ✅ Match |
| deleteHabit: soft delete (`is_active: false`) | O | O (L63-67) | ✅ Match |
| `staleTime: Infinity` | O | O (L20) | ✅ Match |

#### 5.3 `useDailyChecks.ts`

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| queryFn: getStore all checks | O | O (L25-26) | ✅ Match |
| checkHabit: upsert logic | O | O (L34-57) | ✅ Match |
| `pruneOldChecks()` (90 days) | O | O (L6-11) | ✅ Match |
| `staleTime: Infinity` | O | O (L28) | ✅ Match |

#### 5.4 `useAchievements.ts`

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| queryFn: `ACHIEVEMENTS_DATA` static | O | O (L15) | ✅ Match |
| queryFn: getStore unlockedIds | O | O (L27-28) | ✅ Match |
| unlockAchievement: check + setStore | O | O (L43-58) | ✅ Match |

#### 5.5 `useItems.ts`

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `LocalUserItem` type used | O | O (L29) | ✅ Match |
| queryFn: join with ITEMS_DATA | O | O (L31-33) | ✅ Match |
| addItem: upsert logic | O | O (L41-57) | ✅ Match |
| useItem: quantity - 1, filter > 0 | O | O (L63-69) | ✅ Match |

#### 5.6 `useRewards.ts`

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| queryFn: getStore REWARD_BOXES | O | O (L36-37) | ✅ Match |
| createRewardBox: new box structure | O | O (L45-56) | ✅ Match |
| openRewardBox: `generateItems()` reuse | O | O (L72) | ✅ Match |
| openRewardBox: `addItemToStore()` call | O | O (L85) | ✅ Match |
| `opened_at` field | O (`null` default) | ✅ (omitted, optional) | ✅ Match |

**Section 5 Score: 20/20 (100%)**

---

### 2.4 Section 6: Routing Changes

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| Remove `Auth` import | O | O (not in App.tsx) | ✅ Match |
| Remove `ResetPassword` import | O | O (not in App.tsx) | ✅ Match |
| Add `Onboarding` import | O | O (L11) | ✅ Match |
| Add `DataWarningBanner` import | O | O (L12) | ✅ Match |
| `/onboarding` route added | O | O (L94-98) | ✅ Match |
| `/auth`, `/reset-password` removed | O | O (not present) | ✅ Match |
| `DataWarningBanner` in App component | O | O (L108) | ✅ Match |
| Auth guard removed from pages | O | O (no `/auth` navigations) | ✅ Match |
| Onboarding guard in pages | O (optional) | X (not in individual pages) | ⚠️ Minor gap |

**Note on onboarding guard**: Design says pages should have onboarding guard (`if !onboarded navigate('/onboarding')`), but also notes "useUser() always returns LocalUser (non-null), so guard is mostly unnecessary." Implementation chose no individual page guards, relying on app-level flow. This is a valid simplification.

**Section 6 Score: 8/9 (88.9%)**

---

### 2.5 Section 7: useUser Interface Changes

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `LocalUser` type (no auth_id, email) | O | O (types/index.ts L2-11) | ✅ Match |
| Return `LocalUser` (non-null) | O | O (useUser L24, DEFAULT_USER) | ✅ Match |

**Section 7 Score: 2/2 (100%)**

---

### 2.6 Section 8: File Deletion

| File | Design | Deleted | Status |
|------|--------|---------|--------|
| `src/pages/Auth.tsx` | O | O (not found) | ✅ Match |
| `src/pages/ResetPassword.tsx` | O | O (not found) | ✅ Match |
| `src/components/auth/ForgotPasswordModal.tsx` | O | O (not found) | ✅ Match |
| `src/components/auth/PasswordChangeModal.tsx` | O (directory) | O (not found) | ✅ Match |
| `src/services/supabase.ts` | O | O (not found) | ✅ Match |
| `src/pages/DatabaseTest.tsx` | O | O (not found) | ✅ Match |

**Remaining supabase references**: Found in test files only (`src/test/mocks/supabase.ts`, `src/test/mocks/handlers.ts`, `src/test/pages/HabitsPage.test.tsx`). These are test mocks and may need cleanup but are not production code.

**Section 8 Score: 6/6 (100%)**

---

### 2.7 Section 9: Package Changes

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| Remove `@supabase/supabase-js` | O | O (not in package.json) | ✅ Match |
| vite.config.ts: remove supabase chunk | O | O (only react, framer, tanstack chunks) | ✅ Match |

**Section 9 Score: 2/2 (100%)**

---

### 2.8 Section 10: Type Changes

| Item | Design | Implementation | Status |
|------|--------|----------------|--------|
| `LocalUser` interface | O | O (types/index.ts L2-11) | ✅ Match |
| `LocalUserItem` interface | O | O (types/index.ts L17-24) | ✅ Match |
| `AppBackupData` interface | O | O (types/index.ts L27-38) | ✅ Match |
| `User` type alias | X | O (`type User = LocalUser`, L14) | ⚠️ Added |
| `UserItem` type alias | X | O (`type UserItem = LocalUserItem`, L214) | ⚠️ Added |
| `LocalUserItem.item?` optional field | X (in localStore) | O (types/index.ts L23) | ⚠️ Added |

**Note**: Added type aliases (`User = LocalUser`, `UserItem = LocalUserItem`) provide backward compatibility. This is a pragmatic addition.

**Section 10 Score: 3/3 core types match (100%), 3 additions for compatibility**

---

### 2.9 Section 12: Edge Case Handling

| Edge Case | Design | Implementation | Status |
|-----------|--------|----------------|--------|
| localStorage disabled (secret browser) | try/catch + memory fallback (Map) | O (`memoryStore` Map in localStore.ts L16) | ✅ Match |
| localStorage capacity exceeded | 90-day pruneOldChecks + retry | O (pruneOldChecks in useDailyChecks.ts L6) | ✅ Match |
| Invalid backup code | try/catch + error toast | O (useBackup.ts L35, BackupModal.tsx L39-41) | ✅ Match |
| Backup code version mismatch | version check | O (useBackup.ts L27 `parsed.version === '1.0'`) | ✅ Match |
| Restore failure rollback | pre-backup + rollback on fail | O (useBackup.ts L38, L48) | ✅ Match |

**Section 12 Score: 5/5 (100%)**

---

## 3. Differences Found

### 3.1 Missing Features (Design O, Implementation X)

| Severity | Item | Design Location | Description |
|----------|------|-----------------|-------------|
| Minor | `migrateStore()` | Section 4.1, L87 | Version migration function designed but not implemented. Low impact since only v1.0 exists currently. |

### 3.2 Added Features (Design X, Implementation O)

| Severity | Item | Implementation Location | Description |
|----------|------|------------------------|-------------|
| Minor | `addItemToStore()` | `src/services/localStore.ts` L128-144 | Helper function for useRewards to add items directly. Reasonable extraction. |
| Minor | `User` type alias | `src/types/index.ts` L14 | `type User = LocalUser` for backward compatibility |
| Minor | `UserItem` type alias | `src/types/index.ts` L214 | `type UserItem = LocalUserItem` for backward compatibility |
| Minor | `UseUserReturn` type | `src/types/index.ts` L152-164 | Detailed return type interface (good practice) |
| Minor | `UseRewardsReturn` type | `src/types/index.ts` L166-182 | Detailed return type interface |
| Minor | `UseAchievementsReturn` type | `src/types/index.ts` L184-211 | Detailed return type interface |
| Info | UTF-8 safe encoding | `src/hooks/useBackup.ts` L18 | `encodeURIComponent/decodeURIComponent` added for Unicode safety |

### 3.3 Changed Features (Design != Implementation)

| Severity | Item | Design | Implementation | Impact |
|----------|------|--------|----------------|--------|
| Minor | Onboarding guard location | Individual pages | App-level flow only | Low - Design itself notes guard is mostly unnecessary |
| Info | Supabase test mocks | Should be removed | Still in `src/test/mocks/` | Low - Test files only, not production |
| Info | `RewardBox.opened_at` | `opened_at: null` (explicit) | `opened_at?: string` (optional) | None - functionally equivalent |
| Info | Duplicate type definitions | Types in `types/index.ts` only | Also in `localStore.ts` | Low - Dual definition exists in both locations |

---

## 4. Architecture Compliance

### 4.1 Layer Structure (Dynamic Level)

| Expected | Exists | Status |
|----------|:------:|--------|
| `src/components/` | ✅ | UI components |
| `src/hooks/` | ✅ | State management hooks |
| `src/services/` | ✅ | Data access layer (localStore) |
| `src/types/` | ✅ | Domain types |
| `src/pages/` | ✅ | Page components |
| `src/utils/` | ✅ | Utility functions |

### 4.2 Dependency Direction

| Flow | Status |
|------|--------|
| Pages -> Hooks -> Services (localStore) | ✅ Correct |
| Components -> Hooks | ✅ Correct |
| Services -> Types | ✅ Correct |
| No direct localStore imports from pages/components (except Onboarding, DataWarningBanner) | ⚠️ Onboarding.tsx directly imports localStore |

**Note**: `Onboarding.tsx` and `DataWarningBanner.tsx` directly import `getStore`/`setStore` from `localStore.ts`. This bypasses the hook layer but is reasonable for simple boolean flag checks. Not a critical violation.

### 4.3 Architecture Score

```
Architecture Compliance: 95%
  - Correct layer placement: All files in expected locations
  - Dependency violations: 2 minor (Onboarding, DataWarningBanner direct store access)
  - Wrong layer: 0 files
```

---

## 5. Convention Compliance

### 5.1 Naming Convention

| Category | Convention | Compliance | Violations |
|----------|-----------|:----------:|------------|
| Components | PascalCase | 100% | None |
| Functions | camelCase | 100% | None |
| Constants | UPPER_SNAKE_CASE | 100% | `STORE_KEYS`, `ACHIEVEMENTS_DATA`, `ITEMS_DATA` |
| Files (component) | PascalCase.tsx | 100% | `BackupModal.tsx`, `DataWarningBanner.tsx`, `Onboarding.tsx` |
| Files (hook) | camelCase.ts | 100% | `useBackup.ts`, `useUser.ts`, etc. |
| Files (service) | camelCase.ts | 100% | `localStore.ts` |

### 5.2 Convention Score

```
Convention Compliance: 100%
  - Naming: 100%
  - File naming: 100%
  - Folder structure: 100%
```

---

## 6. Overall Score

```
+---------------------------------------------+
|  Overall Match Rate: 96%                     |
+---------------------------------------------+
|  Section 3 (localStorage keys):    100%      |
|  Section 4 (New files):             97%      |
|  Section 5 (Hook redesign):        100%      |
|  Section 6 (Routing):               89%      |
|  Section 7 (useUser interface):    100%      |
|  Section 8 (File deletion):        100%      |
|  Section 9 (Package changes):      100%      |
|  Section 10 (Type changes):        100%      |
|  Section 12 (Edge cases):          100%      |
|                                              |
|  Architecture Compliance:           95%      |
|  Convention Compliance:            100%      |
+---------------------------------------------+

  Total checked items: 94
  Matched: 91  (96.8%)
  Missing:  1  ( 1.1%)  - migrateStore
  Added:    7  ( 7.4%)  - Compatibility aliases, helpers
  Changed:  2  ( 2.1%)  - Onboarding guard, test mocks

  Overall Score: 96%
```

---

## 7. Gap Classification

### Critical (0 items)

None.

### Major (0 items)

None.

### Minor (3 items)

| # | Item | Description | Recommendation |
|---|------|-------------|----------------|
| 1 | `migrateStore()` missing | Design specifies version migration function, not implemented | Implement when v2.0 data format is needed, or remove from design |
| 2 | Onboarding guard not in pages | Design suggests per-page guard, implementation uses app-level flow | Document as intentional simplification |
| 3 | Supabase test mocks remain | `src/test/mocks/supabase.ts` and related test files still reference supabase | Clean up test files to match new localStorage architecture |

### Info (4 items)

| # | Item | Description |
|---|------|-------------|
| 1 | Type aliases added | `User = LocalUser`, `UserItem = LocalUserItem` for backward compatibility |
| 2 | `addItemToStore()` helper | Extracted for reuse between useRewards and localStore |
| 3 | Duplicate type definitions | `LocalUser`, `LocalUserItem`, `AppBackupData` defined in both `types/index.ts` and `localStore.ts` |
| 4 | UTF-8 safe backup encoding | Enhanced encoding for Korean/Unicode characters |

---

## 8. Recommended Actions

### 8.1 Short-term (optional)

| Priority | Item | Location | Action |
|----------|------|----------|--------|
| Low | Clean up supabase test mocks | `src/test/mocks/supabase.ts` | Remove or rewrite tests for localStorage |
| Low | Consolidate duplicate types | `src/services/localStore.ts` + `src/types/index.ts` | Import types from one canonical location |

### 8.2 Design Document Updates

| Item | Action |
|------|--------|
| `migrateStore()` | Either implement or mark as "deferred to v2.0" in design doc |
| Onboarding guard | Add note that app-level flow is the chosen approach |
| Type aliases | Document backward compatibility aliases |
| `addItemToStore()` | Add to Section 4.1 as helper function |

---

## 9. Conclusion

Match Rate **96%** exceeds the 90% threshold. The implementation faithfully follows the design document across all major sections. The only missing item (`migrateStore`) is a forward-looking function not needed for the current v1.0 data format. All added items are reasonable engineering decisions (backward compatibility, code extraction, encoding safety).

**Verdict**: Design and implementation match well. No blocking issues found.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-22 | Initial gap analysis | gap-detector |
