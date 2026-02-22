import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStore, setStore, STORE_KEYS } from '../services/localStore';
import type { LocalUser } from '../services/localStore';
import { BackupModal } from '../components/BackupModal';

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [backupOpen, setBackupOpen] = useState(false);

  const handleStart = () => {
    // 사용자 생성 또는 업데이트
    const existing = getStore<LocalUser | null>(STORE_KEYS.USER, null);
    if (existing) {
      if (username.trim()) {
        setStore(STORE_KEYS.USER, {
          ...existing,
          username: username.trim(),
          updated_at: new Date().toISOString(),
        });
      }
    } else {
      const newUser: LocalUser = {
        id: crypto.randomUUID(),
        username: username.trim() || 'User',
        level: 1,
        exp: 0,
        streak: 0,
        total_habits: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setStore(STORE_KEYS.USER, newUser);
    }
    setStore(STORE_KEYS.ONBOARDED, true);
    setStore(STORE_KEYS.WARNED, true);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-6">
      {step === 1 && (
        <div className="text-center space-y-6 max-w-xs w-full">
          <div className="text-6xl animate-bounce">🐱</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">습관 형성 고양이</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              매일 습관을 쌓고 고양이와 함께 성장하세요.<br />
              로그인 없이 바로 시작할 수 있어요!
            </p>
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full py-4 text-white font-semibold bg-blue-500 rounded-2xl hover:bg-blue-600 active:scale-95 transition-transform"
          >
            시작하기
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center space-y-6 max-w-xs w-full">
          <div className="text-5xl">😺</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">닉네임을 정해요</h2>
            <p className="text-gray-400 text-sm">나중에 프로필에서 바꿀 수 있어요</p>
          </div>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="닉네임 입력 (선택)"
            maxLength={20}
            className="w-full px-4 py-3 text-center text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 text-base"
          />
          <div className="space-y-2">
            <button
              onClick={() => setStep(3)}
              className="w-full py-4 text-white font-semibold bg-blue-500 rounded-2xl hover:bg-blue-600 active:scale-95 transition-transform"
            >
              다음
            </button>
            <button
              onClick={() => { setUsername(''); setStep(3); }}
              className="w-full py-3 text-gray-400 text-sm"
            >
              건너뛰기
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center space-y-6 max-w-xs w-full">
          <div className="text-5xl">💾</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">데이터 저장 안내</h2>
            <div className="text-left bg-amber-50 rounded-xl p-4 space-y-2 text-sm text-amber-700">
              <p>• 데이터는 <strong>이 기기에만</strong> 저장됩니다</p>
              <p>• 브라우저 캐시를 지우면 <strong>데이터가 사라져요</strong></p>
              <p>• 백업 코드로 다른 기기에 옮길 수 있어요</p>
            </div>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setBackupOpen(true)}
              className="w-full py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100"
            >
              기존 백업 코드로 복원하기
            </button>
            <button
              onClick={handleStart}
              className="w-full py-4 text-white font-semibold bg-blue-500 rounded-2xl hover:bg-blue-600 active:scale-95 transition-transform"
            >
              새로 시작하기
            </button>
          </div>
        </div>
      )}

      <BackupModal isOpen={backupOpen} onClose={() => setBackupOpen(false)} />
    </div>
  );
}
