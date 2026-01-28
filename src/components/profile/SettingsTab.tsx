import { useState } from 'react';
import { motion } from 'framer-motion';
import { PasswordChangeModal } from '../auth/PasswordChangeModal';

interface SettingsTabProps {
  onLogout: () => void;
}

export function SettingsTab({ onLogout }: SettingsTabProps) {
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const notifications = [
    { name: '습관 리마인더', description: '매일 9시 알림', enabled: true },
    { name: '보상 알림', description: '상자 획득 시 알림', enabled: false },
  ];

  const themes = [
    { name: '기본', color: 'bg-cozy-orange', active: true },
    { name: '민트', color: 'bg-cozy-sage', active: false },
    { name: '라벤더', color: 'bg-cozy-lavender', active: false },
    { name: '로즈', color: 'bg-cozy-rose', active: false },
  ];

  const accountActions = [
    { icon: '📧', label: '이메일 변경', danger: false, onClick: () => {} },
    { icon: '🔒', label: '비밀번호 변경', danger: false, onClick: () => setShowPasswordChange(true) },
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
          {notifications.map((item, index) => (
            <motion.div
              key={item.name}
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
                className={`w-14 h-8 rounded-full relative transition-colors border-3 ${
                  item.enabled
                    ? 'bg-cozy-sage border-cozy-sage-dark'
                    : 'bg-cozy-brown-light border-cozy-brown'
                }`}
                style={{ borderWidth: '3px' }}
                whileTap={{ scale: 0.9 }}
                role="switch"
                aria-checked={item.enabled}
                aria-label={`${item.name} ${item.enabled ? '켜짐' : '꺼짐'}`}
              >
                <motion.span
                  className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                  initial={false}
                  animate={{ left: item.enabled ? 'calc(100% - 26px)' : '2px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  aria-hidden="true"
                />
              </motion.button>
            </motion.div>
          ))}
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
          {themes.map((theme, index) => (
            <motion.button
              key={theme.name}
              className={`p-3 rounded-xl transition-all border-3 ${
                theme.active
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
              aria-checked={theme.active}
              aria-label={`${theme.name} 테마`}
            >
              <motion.div
                className={`w-10 h-10 rounded-full ${theme.color} mx-auto mb-2 border-3 border-cozy-brown`}
                style={{ borderWidth: '3px', boxShadow: '0 2px 0 var(--cozy-brown-dark)' }}
                animate={theme.active ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                aria-hidden="true"
              />
              <p className="text-xs font-heading font-semibold text-cozy-brown-dark">{theme.name}</p>
              {theme.active && <span className="text-xs" aria-hidden="true">✓</span>}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Account settings */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-display text-lg text-cozy-brown-dark mb-4 flex items-center gap-2">
          <span aria-hidden="true">🔐</span> 계정
        </h3>
        <div className="space-y-3">
          {accountActions.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={item.onClick}
              className="w-full btn-secondary text-left flex items-center gap-3"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + index * 0.08 }}
            >
              <span className="text-xl" aria-hidden="true">{item.icon}</span>
              <span className="font-heading font-semibold">{item.label}</span>
            </motion.button>
          ))}
          <motion.button
            onClick={onLogout}
            className="w-full py-4 px-6 rounded-xl font-heading font-semibold text-white flex items-center justify-center gap-3 border-3"
            style={{
              background: 'linear-gradient(180deg, #E57373 0%, #D32F2F 100%)',
              borderWidth: '3px',
              borderColor: '#B71C1C',
              boxShadow: '0 4px 0 #7F0000',
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98, y: 2 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <span className="text-xl" aria-hidden="true">🚪</span>
            <span>로그아웃</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordChange}
        onClose={() => setShowPasswordChange(false)}
      />
    </motion.div>
  );
}
