import { useState } from 'react';
import { useBackup } from '../hooks/useBackup';
import { useToast } from '../hooks/useToast';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BackupModal({ isOpen, onClose }: BackupModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [backupCode, setBackupCode] = useState('');
  const [importCode, setImportCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { exportBackupCode, importBackupCode, downloadBackupFile } = useBackup();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleExport = () => {
    const code = exportBackupCode();
    setBackupCode(code);
  };

  const handleCopy = () => {
    if (!backupCode) return;
    navigator.clipboard.writeText(backupCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleImport = () => {
    try {
      importBackupCode(importCode.trim());
      showToast({ type: 'success', title: '복원 완료!', message: '데이터가 성공적으로 복원되었습니다.' });
      onClose();
      window.location.reload();
    } catch (error) {
      showToast({ type: 'info', title: '복원 실패', message: error instanceof Error ? error.message : '코드를 확인해주세요.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">데이터 백업/복원</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* 탭 */}
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'export' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
            onClick={() => { setActiveTab('export'); setBackupCode(''); }}
          >
            내보내기
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'import' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
            onClick={() => setActiveTab('import')}
          >
            가져오기
          </button>
        </div>

        <div className="p-4 space-y-4">
          {activeTab === 'export' ? (
            <>
              <p className="text-sm text-gray-600">
                백업 코드를 안전한 곳에 보관하세요.<br />
                이 코드로 언제든 데이터를 복원할 수 있어요.
              </p>

              {backupCode ? (
                <div className="space-y-2">
                  <div className="w-full p-3 bg-gray-50 rounded-lg text-xs text-gray-600 font-mono break-all border border-gray-200">
                    {backupCode}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex-1 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                      {copied ? '복사됨 ✓' : '코드 복사'}
                    </button>
                    <button
                      onClick={downloadBackupFile}
                      className="flex-1 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                    >
                      파일 저장
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleExport}
                  className="w-full py-3 text-sm font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600"
                >
                  백업 코드 생성
                </button>
              )}
            </>
          ) : (
            <>
              <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                ⚠️ 현재 데이터가 모두 백업 코드의 데이터로 교체됩니다.
              </div>
              <textarea
                value={importCode}
                onChange={e => setImportCode(e.target.value)}
                placeholder="LOOT- 로 시작하는 코드를 입력하세요..."
                className="w-full h-24 p-3 text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleImport}
                disabled={!importCode.trim()}
                className="w-full py-3 text-sm font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                복원하기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
