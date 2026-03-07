import { motion } from 'framer-motion';
import { useSettings } from '../../hooks/useSettings';
import type { AppSettings } from '../../services/localStore';

interface SettingsTabProps {
  onBackup: () => void;
}

export function SettingsTab({ onBackup }: SettingsTabProps) {
  const { settings, updateNotification, updateTheme } = useSettings();

  const notifications: { key: keyof AppSettings['notifications']; name: string; description: string }[] = [
    { key: 'habitReminder', name: '습관 리마인더', description: '매일 9시 알림' },
    { key: 'rewardAlert', name: '보상 알림', description: '상자 획득 시 알림' },
  ];

  const themes: { name: string; color: string; value: AppSettings['theme'] }[] = [
    { name: '기본', color: 'bg-cozy-orange', value: 'default' },
    { name: '민트', color: 'bg-cozy-sage', value: 'mint' },
    { name: '라벤더', color: 'bg-cozy-lavender', value: 'lavender' },
    { name: '로즈', color: 'bg-cozy-rose', value: 'rose' },
  ];

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Notification settings */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-display text-lg text-cozy-brown-dark mb-4 flex items-center gap-2">
          <span aria-hidden="true">🔔</span> 알림 설정
        </h3>
        <div className="space-y-4" role="group" aria-label="알림 설정">
          {notifications.map((item, index) => {
            const enabled = settings.notifications[item.key];
            return (
              <motion.div
                key={item.key}
                className="flex items-center justify-between p-3 bg-cozy-cream rounded-xl border-2 border-cozy-brown-light"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.08 }}
              >
                <div>
                  <p className="font-heading font-semibold text-cozy-brown-dark">{item.name}</p>
                  <p className="text-xs text-cozy-brown font-body">{item.description}</p>
                </div>
                <motion.button
                  onClick={() => updateNotification(item.key, !enabled)}
                  className={`w-14 h-8 rounded-full relative transition-colors border-3 ${
                    enabled
                      ? 'bg-cozy-sage border-cozy-sage-dark'
                      : 'bg-cozy-brown-light border-cozy-brown'
                  }`}
                  style={{ borderWidth: '3px' }}
                  whileTap={{ scale: 0.9 }}
                  role="switch"
                  aria-checked={enabled}
                  aria-label={`${item.name} ${enabled ? '켜짐' : '꺼짐'}`}
                >
                  <motion.span
                    className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                    initial={false}
                    animate={{ left: enabled ? 'calc(100% - 26px)' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    aria-hidden="true"
                  />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Theme settings */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-display text-lg text-cozy-brown-dark mb-4 flex items-center gap-2">
          <span className="animate-wiggle inline-block" aria-hidden="true">🎨</span> 테마 설정
        </h3>
        <div className="grid grid-cols-4 gap-3" role="radiogroup" aria-label="테마 선택">
          {themes.map((theme, index) => {
            const active = settings.theme === theme.value;
            return (
              <motion.button
                key={theme.value}
                onClick={() => updateTheme(theme.value)}
                className={`p-3 rounded-xl transition-all border-3 ${
                  active
                    ? 'bg-cozy-paper border-cozy-orange shadow-md'
                    : 'bg-cozy-cream border-cozy-brown-light'
                }`}
                style={{ borderWidth: '3px' }}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + index * 0.08 }}
                role="radio"
                aria-checked={active}
                aria-label={`${theme.name} 테마`}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full ${theme.color} mx-auto mb-2 border-3 border-cozy-brown`}
                  style={{ borderWidth: '3px', boxShadow: '0 2px 0 var(--cozy-brown-dark)' }}
                  animate={active ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  aria-hidden="true"
                />
                <p className="text-xs font-heading font-semibold text-cozy-brown-dark">{theme.name}</p>
                {active && <span className="text-xs" aria-hidden="true">✓</span>}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Data settings */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-display text-lg text-cozy-brown-dark mb-4 flex items-center gap-2">
          <span aria-hidden="true">💾</span> 데이터
        </h3>
        <div className="space-y-3">
          <motion.button
            onClick={onBackup}
            className="w-full btn-secondary text-left flex items-center gap-3"
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <span className="text-xl" aria-hidden="true">📦</span>
            <span className="font-heading font-semibold">데이터 백업/복원</span>
          </motion.button>
          <p className="text-xs text-cozy-brown px-1">
            백업 코드를 생성해 데이터를 안전하게 보관하세요.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
