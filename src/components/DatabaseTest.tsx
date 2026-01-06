
import { useState } from 'react';
import { runAllDatabaseTests, type TestResults } from '../utils/database-tests';

// 데이터베이스 테스트 컴포넌트
export const DatabaseTestComponent = () => {
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(false);
  
  const runTests = async () => {
    setLoading(true);
    try {
      const results = await runAllDatabaseTests();
      setTestResults(results);
    } catch (error) {
      console.error('테스트 실행 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">데이터베이스 테스트</h1>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="btn-primary mb-6"
      >
        {loading ? '테스트 실행 중...' : '데이터베이스 테스트 실행'}
      </button>
      
      {testResults && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${
            testResults.connection ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <h3 className="font-semibold">연결 테스트</h3>
            <p>{testResults.connection ? '✅ 성공' : '❌ 실패'}</p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            testResults.user ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <h3 className="font-semibold">사용자 CRUD 테스트</h3>
            <p>{testResults.user ? '✅ 성공' : '❌ 실패'}</p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            testResults.habit ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <h3 className="font-semibold">습관 CRUD 테스트</h3>
            <p>{testResults.habit ? '✅ 성공' : '❌ 실패'}</p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            testResults.dailyCheck ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <h3 className="font-semibold">일일 체크 CRUD 테스트</h3>
            <p>{testResults.dailyCheck ? '✅ 성공' : '❌ 실패'}</p>
          </div>
          
          {testResults.errors.length > 0 && (
            <div className="p-4 rounded-lg bg-red-100">
              <h3 className="font-semibold text-red-800">오류 목록</h3>
              <ul className="list-disc list-inside text-red-700">
                {testResults.errors.map((error: string, index: number) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};