import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStore, setStore, STORE_KEYS, DEFAULT_SETTINGS } from '../services/localStore';
import type { AppSettings } from '../services/localStore';

export function useSettings() {
  const queryClient = useQueryClient();

  const { data: settings = DEFAULT_SETTINGS } = useQuery({
    queryKey: ['settings'],
    queryFn: (): AppSettings => getStore<AppSettings>(STORE_KEYS.SETTINGS, DEFAULT_SETTINGS),
    staleTime: Infinity,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<AppSettings>): Promise<AppSettings> => {
      const current = getStore<AppSettings>(STORE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      const next = { ...current, ...updates };
      setStore(STORE_KEYS.SETTINGS, next);
      return next;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const updateNotification = (key: keyof AppSettings['notifications'], value: boolean) => {
    const current = getStore<AppSettings>(STORE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    updateSettingsMutation.mutate({
      notifications: { ...current.notifications, [key]: value },
    });
  };

  const updateTheme = (theme: AppSettings['theme']) => {
    updateSettingsMutation.mutate({ theme });
    document.documentElement.setAttribute('data-theme', theme);
  };

  return { settings, updateNotification, updateTheme };
}
