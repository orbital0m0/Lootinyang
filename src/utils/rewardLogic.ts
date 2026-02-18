import type { Item, RewardBox } from '../types';
import { ITEMS_DATA } from './constants';

// 상자 타입별 아이템 등급 확률 테이블
const RARITY_PROBABILITIES: Record<RewardBox['type'], Record<Item['rarity'], number>> = {
  daily:   { common: 0.70, rare: 0.25, epic: 0.04, legendary: 0.01 },
  weekly:  { common: 0.40, rare: 0.40, epic: 0.15, legendary: 0.05 },
  monthly: { common: 0.20, rare: 0.35, epic: 0.30, legendary: 0.15 },
  special: { common: 0.05, rare: 0.30, epic: 0.45, legendary: 0.20 },
};

// 상자 타입별 아이템 개수
const ITEMS_PER_BOX: Record<RewardBox['type'], number> = {
  daily: 1,
  weekly: 2,
  monthly: 3,
  special: 3,
};

// 가중치 기반 랜덤 등급 선택
export function selectRarity(boxType: RewardBox['type']): Item['rarity'] {
  const probabilities = RARITY_PROBABILITIES[boxType];
  const random = Math.random();
  let cumulative = 0;

  for (const [rarity, probability] of Object.entries(probabilities)) {
    cumulative += probability;
    if (random <= cumulative) {
      return rarity as Item['rarity'];
    }
  }

  return 'common';
}

// 특정 등급의 랜덤 아이템 선택
export function selectItemByRarity(rarity: Item['rarity']): Item {
  const candidates = ITEMS_DATA.filter(item => item.rarity === rarity);
  if (candidates.length === 0) {
    // 해당 등급 아이템이 없으면 common에서 선택
    const fallback = ITEMS_DATA.filter(item => item.rarity === 'common');
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// 상자 타입에 따라 랜덤 아이템 배열 생성
export function generateItems(boxType: RewardBox['type']): Item[] {
  const count = ITEMS_PER_BOX[boxType];
  const items: Item[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < count; i++) {
    const rarity = selectRarity(boxType);
    let item = selectItemByRarity(rarity);

    // 중복 방지 (최대 3번 재시도)
    let retries = 0;
    while (usedIds.has(item.id) && retries < 3) {
      item = selectItemByRarity(rarity);
      retries++;
    }

    usedIds.add(item.id);
    items.push(item);
  }

  return items;
}
