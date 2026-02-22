import { useState } from 'react';
import { getStore, setStore, STORE_KEYS } from '../services/localStore';
import { BackupModal } from './BackupModal';

export function DataWarningBanner() {
  const [visible, setVisible] = useState(() => !getStore(STORE_KEYS.WARNED, false));
  const [backupOpen, setBackupOpen] = useState(false);

  if (!visible) return null;

  const handleDismiss = () => {
    setStore(STORE_KEYS.WARNED, true);
    setVisible(false);
  };

  return (
    <>
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="max-w-sm mx-auto">
          <p className="text-xs text-amber-700 mb-2">
            💾 이 앱은 데이터를 이 브라우저에 저장합니다. 브라우저 캐시를 삭제하면 데이터가 사라져요. 백업 코드로 데이터를 안전하게 보관하세요.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setBackupOpen(true)}
              className="text-xs font-medium text-amber-700 underline"
            >
              백업하기
            </button>
            <span className="text-amber-300">|</span>
            <button
              onClick={handleDismiss}
              className="text-xs font-medium text-amber-700 underline"
            >
              확인했어요
            </button>
          </div>
        </div>
      </div>
      <BackupModal isOpen={backupOpen} onClose={() => setBackupOpen(false)} />
    </>
  );
}
