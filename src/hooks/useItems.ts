import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '../services/supabase';
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
    queryFn: () => {
      if (!userId) throw new Error('사용자 ID가 필요합니다.');
      return supabaseHelpers.getUserItems(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const addItemMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (!userId) throw new Error('사용자 ID가 필요합니다.');
      return supabaseHelpers.addUserItem(userId, itemId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userItems', userId] });
    },
  });

  const useItemMutation = useMutation({
    mutationFn: async (userItemId: string) => {
      return supabaseHelpers.useUserItem(userItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userItems', userId] });
    },
  });

  const addItem = async (itemId: string, quantity: number = 1) => {
    await addItemMutation.mutateAsync({ itemId, quantity });
  };

  const useItem = async (userItemId: string) => {
    await useItemMutation.mutateAsync(userItemId);
  };

  const getItemCount = (itemId: string): number => {
    const found = items.find((ui: UserItem) => ui.item_id === itemId);
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
