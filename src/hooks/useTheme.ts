import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, STORE_KEYS } from '../services/localStore';
import { applyTheme, THEMES, getThemePreviewColor } from '../utils/themes';
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

  // 기본 보유 테마: warm-white는 항상 보유
  const ownedThemeIds = [
    'warm-white',
    ...inventory.ownedItems.filter(id => id in THEMES && id !== 'warm-white'),
  ];

  const setTheme = useCallback((themeId: string) => {
    if (!THEMES[themeId]) return;

    const inv = getStore<UserInventory>(STORE_KEYS.INVENTORY, DEFAULT_INVENTORY);
    const isOwned = themeId === 'warm-white' || inv.ownedItems.includes(themeId);

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
    if (themeId === 'warm-white') return true;
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
