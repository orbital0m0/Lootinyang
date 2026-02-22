import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../hooks';
import { ProfileHeader, LevelCard, StatisticsTab, SettingsTab } from '../components/profile';
import { BackupModal } from '../components/BackupModal';

export function Profile() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'stats' | 'settings'>('stats');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);

  const level = user.level;
  const exp = user.exp;
  const expToNext = level * 100;

  const handleLevelUp = () => {
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), 2000);
  };

  return (
    <div className="p-4 pb-24 space-y-5 page-enter">
      {/* Profile Header */}
      <ProfileHeader user={user} showLevelUp={showLevelUp} />

      {/* Level Card */}
      <LevelCard
        level={level}
        exp={exp}
        expToNext={expToNext}
        showLevelUp={showLevelUp}
        onLevelUpTest={handleLevelUp}
      />

      {/* Tab Navigation */}
      <motion.div
        className="flex bg-cozy-cream rounded-2xl p-1 border-3 border-cozy-brown-light"
        style={{ borderWidth: '3px' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        role="tablist"
        aria-label="프로필 탭"
      >
        <motion.button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all ${
            activeTab === 'stats'
              ? 'bg-cozy-lavender text-white shadow-md'
              : 'text-cozy-brown hover:bg-cozy-paper'
          }`}
          whileTap={{ scale: 0.98 }}
          role="tab"
          aria-selected={activeTab === 'stats'}
          aria-controls="stats-panel"
          id="stats-tab"
        >
          <span className="mr-1" aria-hidden="true">📈</span> 통계
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all ${
            activeTab === 'settings'
              ? 'bg-cozy-sage text-white shadow-md'
              : 'text-cozy-brown hover:bg-cozy-paper'
          }`}
          whileTap={{ scale: 0.98 }}
          role="tab"
          aria-selected={activeTab === 'settings'}
          aria-controls="settings-panel"
          id="settings-tab"
        >
          <span className="mr-1" aria-hidden="true">⚙️</span> 설정
        </motion.button>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'stats' ? (
          <div id="stats-panel" role="tabpanel" aria-labelledby="stats-tab">
            <StatisticsTab user={user} />
          </div>
        ) : (
          <div id="settings-panel" role="tabpanel" aria-labelledby="settings-tab">
            <SettingsTab onBackup={() => setBackupOpen(true)} />
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        className="text-center py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-center gap-4 text-sm text-cozy-brown font-body">
          <button className="hover:text-cozy-brown-dark transition-colors">개인정보처리방침</button>
          <span className="text-cozy-brown-light" aria-hidden="true">•</span>
          <button className="hover:text-cozy-brown-dark transition-colors">이용약관</button>
        </div>
        <p className="text-xs text-cozy-brown-light mt-2">Lootinyang v1.0.0</p>
      </motion.div>

      <BackupModal isOpen={backupOpen} onClose={() => setBackupOpen(false)} />
    </div>
  );
}
