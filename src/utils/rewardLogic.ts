import type { RewardItem, RewardBox, Rarity } from '../types';
import { REWARD_ITEMS } from './constants';

// 중복 드롭 시 XP 전환 테이블 (설계서 §1)
export const DUPLICATE_XP: Record<Rarity, number> = {
  common: 50,
  rare: 100,
  epic: 200,
  legendary: 500,
};

// 상자 타입별 아이템 등급 확률 테이블 (설계서 §1)
const RARITY_PROBABILITIES: Record<RewardBox['type'], Record<Rarity, number>> = {
  normal:  { common: 0.55, rare: 0.28, epic: 0.13, legendary: 0.04 },
  premium: { common: 0.20, rare: 0.35, epic: 0.30, legendary: 0.15 },
  event:   { common: 0.00, rare: 0.00, epic: 0.50, legendary: 0.50 },
};

// 상자 타입별 아이템 개수
const ITEMS_PER_BOX: Record<RewardBox['type'], number> = {
  normal:  1,
  premium: 2,
  event:   1,
};

// 가중치 기반 랜덤 등급 선택
export function selectRarity(boxType: RewardBox['type']): Rarity {
  const probabilities = RARITY_PROBABILITIES[boxType];
  const random = Math.random();
  let cumulative = 0;

  for (const [rarity, probability] of Object.entries(probabilities)) {
    cumulative += probability;
    if (random <= cumulative) {
      return rarity as Rarity;
    }
  }

  return 'common';
}

// 특정 등급의 랜덤 아이템 선택 (소유 아이템 제외 가능)
export function selectItemByRarity(rarity: Rarity, excludeIds: Set<string> = new Set()): RewardItem {
  const candidates = REWARD_ITEMS.filter(
    item => item.rarity === rarity && !excludeIds.has(item.id)
  );

  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // 해당 등급 미소유 아이템이 없으면 전체 해당 등급에서 선택 (중복 → XP 처리)
  const fallback = REWARD_ITEMS.filter(item => item.rarity === rarity);
  if (fallback.length > 0) {
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  // 최종 폴백: common에서 선택
  const common = REWARD_ITEMS.filter(item => item.rarity === 'common');
  return common[Math.floor(Math.random() * common.length)];
}

// 상자 타입에 따라 아이템 배열 생성
// ownedItemIds: 이미 소유한 아이템 ID 목록 (중복 여부 판단용)
export function generateItems(
  boxType: RewardBox['type'],
  ownedItemIds: string[] = []
): Array<{ item: RewardItem; isDuplicate: boolean; bonusXp: number }> {
  const count = ITEMS_PER_BOX[boxType];
  const results: Array<{ item: RewardItem; isDuplicate: boolean; bonusXp: number }> = [];
  const ownedSet = new Set(ownedItemIds);
  const usedInBox = new Set<string>();

  for (let i = 0; i < count; i++) {
    const rarity = selectRarity(boxType);
    // 이번 상자에서 이미 뽑은 것 제외
    const item = selectItemByRarity(rarity, usedInBox);
    usedInBox.add(item.id);

    const isDuplicate = ownedSet.has(item.id);
    const bonusXp = isDuplicate ? DUPLICATE_XP[item.rarity] : 0;

    results.push({ item, isDuplicate, bonusXp });
  }

  return results;
}

// 단순 아이템 배열 반환 (하위 호환성)
export function generateRewardItems(
  boxType: RewardBox['type'],
  ownedItemIds: string[] = []
): RewardItem[] {
  return generateItems(boxType, ownedItemIds).map(r => r.item);
}
