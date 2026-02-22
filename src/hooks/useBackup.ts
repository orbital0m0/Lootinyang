import { useQueryClient } from '@tanstack/react-query';
import { exportAllData, importAllData } from '../services/localStore';
import type { AppBackupData } from '../services/localStore';

export interface UseBackupReturn {
  exportBackupCode: () => string;
  importBackupCode: (code: string) => void;
  downloadBackupFile: () => void;
  isValidCode: (code: string) => boolean;
}

export function useBackup(): UseBackupReturn {
  const queryClient = useQueryClient();

  // 백업 코드 생성: "LOOT-" + btoa(JSON)
  const exportBackupCode = (): string => {
    const data = exportAllData();
    return 'LOOT-' + btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  };

  // 백업 코드 유효성 검사
  const isValidCode = (code: string): boolean => {
    if (!code.startsWith('LOOT-')) return false;
    try {
      const json = decodeURIComponent(escape(atob(code.slice(5))));
      const parsed: AppBackupData = JSON.parse(json);
      return parsed.version === '1.0' && !!parsed.data;
    } catch {
      return false;
    }
  };

  // 백업 코드로 복원
  const importBackupCode = (code: string): void => {
    if (!isValidCode(code)) throw new Error('유효하지 않은 백업 코드입니다.');

    // 복원 전 현재 데이터 임시 백업 (롤백 대비)
    const currentData = exportAllData();

    try {
      const json = decodeURIComponent(escape(atob(code.slice(5))));
      const data: AppBackupData = JSON.parse(json);
      importAllData(data);
      // 전체 쿼리 캐시 초기화
      queryClient.invalidateQueries();
    } catch (error) {
      // 복원 실패 시 롤백
      importAllData(currentData);
      throw new Error('복원 중 오류가 발생했습니다. 이전 데이터로 복구합니다.');
    }
  };

  // .json 파일 다운로드
  const downloadBackupFile = (): void => {
    const data = exportAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lootinyang-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return { exportBackupCode, importBackupCode, downloadBackupFile, isValidCode };
}
