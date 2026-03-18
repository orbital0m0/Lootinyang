import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, STORE_KEYS } from '../services/localStore';
import { applyTheme, THEMES, getThemePreviewColor } from '../utils/themes';
import { DEFAULT_OWNED_IDS } from './useInventory';
import type { UserInventory } from '../types';
import { DEFAULT_INVENTORY } from '../types';
import { useToast } from './useToast';

export interface UseThemeReturn {
  currentThemeId: string;
  isDark: boolean;
  setTheme: (themeId: string) => void;
  ownedThemeIds: string[];
  isOwned: (themeId: string) => boolean;
  allThemeIds: string[];
  getPreviewColor: (themeId: string) => string;
}

export function useTheme(): UseThemeReturn {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [currentThemeId, setCurrentThemeId] = useState<string>(() =>
    getStore<string>(STORE_KEYS.THEME, 'warm-white')
  );

  const inventory = getStore<UserInventory>(STORE_KEYS.INVENTORY, DEFAULT_INVENTORY);

  // 보유 테마: 기본 소유(DEFAULT_OWNED_IDS) + 획득 아이템 중 테마인 것
  const ownedThemeIds = Object.keys(THEMES).filter(id =>
    DEFAULT_OWNED_IDS.has(id) || inventory.ownedItems.includes(id)
  );

  const setTheme = useCallback((themeId: string) => {
    if (!THEMES[themeId]) return;

    const inv = getStore<UserInventory>(STORE_KEYS.INVENTORY, DEFAULT_INVENTORY);
    const isOwned = DEFAULT_OWNED_IDS.has(themeId) || inv.ownedItems.includes(themeId);

    if (!isOwned) {
      showToast({
        type: 'info',
        title: '잠긴 테마',
        message: '보상 상자에서 획득할 수 있어요!',
        duration: 2500,
      });
      return;
    }

    applyTheme(themeId);
    setCurrentThemeId(themeId);

    // 인벤토리 equipped 업데이트
    setStore(STORE_KEYS.INVENTORY, {
      ...inv,
      equipped: { ...inv.equipped, theme: themeId },
    });

    queryClient.invalidateQueries({ queryKey: ['inventory'] });
  }, [queryClient, showToast]);

  const isOwned = useCallback((themeId: string): boolean => {
    if (DEFAULT_OWNED_IDS.has(themeId)) return true;
    const inv = getStore<UserInventory>(STORE_KEYS.INVENTORY, DEFAULT_INVENTORY);
    return inv.ownedItems.includes(themeId);
  }, []);

  const isDark = THEMES[currentThemeId]?.isDark ?? false;

  return {
    currentThemeId,
    isDark,
    setTheme,
    ownedThemeIds,
    isOwned,
    allThemeIds: Object.keys(THEMES),
    getPreviewColor: getThemePreviewColor,
  };
}
