import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, STORE_KEYS } from '../services/localStore';
import type { LocalUserItem } from '../services/localStore';
import { ITEMS_DATA } from '../utils/constants';
import type { UserItem } from '../types';

export interface UseItemsReturn {
  items: UserItem[];
  loading: boolean;
  error: string | null;
  addItem: (itemId: string, quantity?: number) => Promise<void>;
  useItem: (userItemId: string) => Promise<void>;
  getItemCount: (itemId: string) => number;
  hasProtectionShield: () => boolean;
  refetch: () => void;
}

export function useItems(userId?: string): UseItemsReturn {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userItems', userId],
    queryFn: (): UserItem[] => {
      const stored = getStore<LocalUserItem[]>(STORE_KEYS.USER_ITEMS, []);
      // ITEMS_DATA와 join
      return stored.map(ui => ({
        ...ui,
        item: ITEMS_DATA.find(i => i.id === ui.item_id),
      }));
    },
    staleTime: Infinity,
    retry: false,
  });

  const addItemMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }): Promise<void> => {
      const stored = getStore<LocalUserItem[]>(STORE_KEYS.USER_ITEMS, []);
      const existing = stored.find(i => i.item_id === itemId);
      if (existing) {
        setStore(STORE_KEYS.USER_ITEMS, stored.map(i =>
          i.item_id === itemId ? { ...i, quantity: i.quantity + quantity } : i
        ));
      } else {
        setStore(STORE_KEYS.USER_ITEMS, [...stored, {
          id: crypto.randomUUID(),
          item_id: itemId,
          quantity,
          is_used: false,
          acquired_at: new Date().toISOString(),
        }]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userItems', userId] });
    },
  });

  const useItemMutation = useMutation({
    mutationFn: async (userItemId: string): Promise<void> => {
      const stored = getStore<LocalUserItem[]>(STORE_KEYS.USER_ITEMS, []);
      const updated = stored
        .map(i => i.id === userItemId ? { ...i, quantity: i.quantity - 1 } : i)
        .filter(i => i.quantity > 0);
      setStore(STORE_KEYS.USER_ITEMS, updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userItems', userId] });
    },
  });

  const addItem = async (itemId: string, quantity = 1) => {
    await addItemMutation.mutateAsync({ itemId, quantity });
  };

  const useItem = async (userItemId: string) => {
    await useItemMutation.mutateAsync(userItemId);
  };

  const getItemCount = (itemId: string): number => {
    const found = items.find(ui => ui.item_id === itemId);
    return found?.quantity ?? 0;
  };

  const hasProtectionShield = (): boolean => {
    return getItemCount('protection_shield') > 0;
  };

  return {
    items,
    loading: isLoading,
    error: error?.message || null,
    addItem,
    useItem,
    getItemCount,
    hasProtectionShield,
    refetch,
  };
}
