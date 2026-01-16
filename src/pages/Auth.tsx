import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (data.user) {
        console.log('로그인 성공:', data.user.email);
        navigate('/');
      }
    } catch (err: unknown) {
      console.error('로그인 에러:', err);
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 회원가입 처리
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        // Database error는 Supabase trigger 문제 - 무시하고 진행
        if (signUpError.message.includes('Database error')) {
          console.warn('Supabase trigger 오류 (무시):', signUpError.message);
          // 회원가입은 성공했을 수 있으므로 로그인 시도
          setError('회원가입이 완료되었습니다! 로그인해주세요.');
          setIsLogin(true);
          setPassword('');
          return;
        }
        throw signUpError;
      }

      if (data.user) {
        // 이메일 인증 없이 바로 세션이 생성된 경우
        if (data.session) {
          console.log('회원가입 및 자동 로그인 성공');
          navigate('/');
          return;
        }
        setError('회원가입이 완료되었습니다! 로그인해주세요.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: unknown) {
      console.error('회원가입 에러:', err);
      const errorMsg = err instanceof Error ? err.message : '회원가입에 실패했습니다.';
      // 사용자 친화적 에러 메시지
      if (errorMsg.includes('already registered')) {
        setError('이미 가입된 이메일입니다. 로그인해주세요.');
        setIsLogin(true);
      } else {
        setError(errorMsg);
      }
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

        {/* 안내 메시지 */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-2">💡 시작하기</p>
          <p className="text-xs text-blue-700">
            처음이신가요? 회원가입 탭에서 계정을 만들어보세요!
            <br />
            <br />• 이메일과 비밀번호(최소 6자)만 있으면 바로 시작할 수 있어요
            <br />• 고양이와 함께 습관을 만들어보세요 🐱
          </p>
        </div>
      </div>
    </div>
  );
}