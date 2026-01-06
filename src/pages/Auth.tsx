// 간단화된 인증 헬퍼 - 타입 오류 방지
import { useState } from 'react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 로그인 처리 - 에러만 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call for testing
      console.log('로그인 시도:', { email, password });
      
      // 테스트용 성공 응답
      if (email === 'test@example.com' && password === 'password123') {
        console.log('로그인 성공 - 테스트 모드');
        window.location.href = '/';
        return;
      }
      
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 회원가입 처리 - 에러만 처리
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call for testing
      console.log('회원가입 시도:', { email, username, password });
      
      // 테스트용 성공 응답
      if (email && username && password && password.length >= 6) {
        console.log('회원가입 성공 - 테스트 모드');
        setError('회원가입이 완료되었습니다. 이메일을 확인해주세요.');
        return;
      }
      
      throw new Error('입력 정보가 올바르지 않습니다.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <span className="text-6xl animate-bounce-slow">🐱</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">Lootinyang</h1>
          <p className="text-gray-600">습관 형성을 위한 귀여운 여행</p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 탭 */}
        <div className="flex mb-6">
          <button
            className={`flex-1 pb-2 border-b-2 text-sm font-medium transition-colors ${
              isLogin 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setIsLogin(true)}
          >
            로그인
          </button>
          <button
            className={`flex-1 pb-2 border-b-2 text-sm font-medium transition-colors ${
              !isLogin 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setIsLogin(false)}
          >
            회원가입
          </button>
        </div>

        {/* 폼 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {isLogin ? (
            /* 로그인 폼 */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>
          ) : (
            /* 회원가입 폼 */
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사용자 이름
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="사용자 이름을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="비밀번호를 입력하세요"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? '가입 중...' : '회원가입'}
              </button>
            </form>
          )}
        </div>

        {/* 데모 계정 정보 */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-medium text-yellow-800 mb-2">🧪 데모 계정</p>
          <p className="text-xs text-yellow-700">
            테스트용 계정:
            <br />이메일: test@example.com
            <br />비밀번호: password123
            <br />
            <br />* 회원가입은 사용자 이름을 포함해야 합니다
          </p>
        </div>
      </div>
    </div>
  );
}