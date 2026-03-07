# Gap Detector Memory

## Project: Lootinyang (habit-cat-app)
- Architecture Level: Dynamic
- Stack: React + TypeScript + TanStack Query + localStorage
- No backend/API - pure client-side app

## Completed Analyses

### local-storage-mode (2026-02-22)
- Match Rate: 96%
- Design: `docs/02-design/features/local-storage-mode.design.md`
- Analysis: `docs/03-analysis/features/local-storage-mode.analysis.md`
- Key finding: `migrateStore()` not implemented (deferred)
- Supabase fully removed from production code; test mocks remain in `src/test/mocks/`
- Types are duplicated in `src/types/index.ts` AND `src/services/localStore.ts`

## Project Structure Notes
- Hooks: `src/hooks/` (useUser, useHabits, useDailyChecks, useAchievements, useItems, useRewards, useGameEvents, useAchievementChecker, useBackup)
- Services: `src/services/localStore.ts` (single service file)
- Static data: `src/utils/constants.ts` (ACHIEVEMENTS_DATA, ITEMS_DATA, APP_CONFIG)
- Pages use `user.id` (non-null) consistently since localStorage mode
