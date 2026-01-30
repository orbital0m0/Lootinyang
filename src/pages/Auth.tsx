import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, supabaseHelpers } from '../services/supabase';
import { ForgotPasswordModal } from '../components/auth/ForgotPasswordModal';

export function AuthPage() {
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      await supabaseHelpers.signInWithGoogle();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google 로그인에 실패했습니다.');
      setGoogleLoading(false);
    }
  };

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
        navigate('/');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('Database error')) {
          setSuccess('회원가입이 완료되었습니다! 로그인해주세요.');
          setIsLogin(true);
          setPassword('');
          return;
        }
        throw signUpError;
      }

      if (data.user) {
        if (data.session) {
          navigate('/');
          return;
        }
        setSuccess('회원가입이 완료되었습니다! 로그인해주세요.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : '회원가입에 실패했습니다.';
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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'var(--cozy-cream)',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(232, 168, 124, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(156, 175, 136, 0.15) 0%, transparent 50%)
        `,
      }}
    >
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 헤더 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="relative inline-block"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <span className="text-7xl block">🐱</span>
            <motion.span
              className="absolute -top-2 -right-2 text-2xl"
              animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ✨
            </motion.span>
          </motion.div>
          <h1 className="font-display text-4xl text-cozy-brown-dark mt-4 mb-2">Lootinyang</h1>
          <p className="text-cozy-brown font-body">습관 형성을 위한 코지한 여행</p>
        </motion.div>

        {/* 알림 메시지 */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              className="card-habit mb-4 border-red-300"
              style={{ background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)', borderColor: '#F87171' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              role="alert"
              aria-live="assertive"
            >
              <p className="text-red-700 font-body text-sm">{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div
              className="card-habit mb-4"
              style={{ background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)', borderColor: '#34D399' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              role="status"
              aria-live="polite"
            >
              <p className="text-green-700 font-body text-sm">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 메인 카드 */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Google 로그인 버튼 */}
          <motion.button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl border-3 border-cozy-brown-light bg-white hover:bg-gray-50 transition-all font-heading font-semibold text-cozy-brown-dark disabled:opacity-60"
            style={{ borderWidth: '3px' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {googleLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                🐱
              </motion.span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {googleLoading ? 'Google 로그인 중...' : 'Google로 계속하기'}
          </motion.button>

          {/* 구분선 */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-cozy-brown-light" />
            <span className="text-sm text-cozy-brown font-body">또는</span>
            <div className="flex-1 h-px bg-cozy-brown-light" />
          </div>

          {/* 이메일 로그인 토글 */}
          {!showEmailForm ? (
            <motion.button
              onClick={() => setShowEmailForm(true)}
              className="w-full py-3 text-cozy-brown hover:text-cozy-orange transition-colors font-body text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📧 이메일로 {isLogin ? '로그인' : '회원가입'}하기
            </motion.button>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {/* 탭 */}
                <div
                  className="flex mb-4 bg-cozy-cream rounded-xl p-1 border-2 border-cozy-brown-light"
                >
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg font-heading font-semibold text-sm transition-all ${
                      isLogin
                        ? 'bg-cozy-orange text-white shadow-sm'
                        : 'text-cozy-brown hover:bg-cozy-paper'
                    }`}
                    onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                  >
                    로그인
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded-lg font-heading font-semibold text-sm transition-all ${
                      !isLogin
                        ? 'bg-cozy-sage text-white shadow-sm'
                        : 'text-cozy-brown hover:bg-cozy-paper'
                    }`}
                    onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                  >
                    회원가입
                  </button>
                </div>

                {/* 폼 */}
                <AnimatePresence mode="wait">
                  {isLogin ? (
                    <motion.form
                      key="login"
                      onSubmit={handleLogin}
                      className="space-y-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <div>
                        <label htmlFor="login-email" className="block font-heading font-semibold text-cozy-brown-dark mb-1 text-sm">
                          이메일
                        </label>
                        <input
                          id="login-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-cozy-brown-light bg-cozy-cream font-body focus:border-cozy-orange focus:outline-none transition-colors"
                          placeholder="이메일을 입력하세요"
                          required
                          autoComplete="email"
                        />
                      </div>
                      <div>
                        <label htmlFor="login-password" className="block font-heading font-semibold text-cozy-brown-dark mb-1 text-sm">
                          비밀번호
                        </label>
                        <input
                          id="login-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-cozy-brown-light bg-cozy-cream font-body focus:border-cozy-orange focus:outline-none transition-colors"
                          placeholder="비밀번호를 입력하세요"
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="mt-1 text-xs text-cozy-brown hover:text-cozy-orange transition-colors font-body"
                        >
                          비밀번호를 잊으셨나요?
                        </button>
                      </div>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-cat disabled:opacity-60"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            >
                              🐱
                            </motion.span>
                            로그인 중...
                          </span>
                        ) : (
                          '로그인'
                        )}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="signup"
                      onSubmit={handleSignUp}
                      className="space-y-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div>
                        <label htmlFor="signup-username" className="block font-heading font-semibold text-cozy-brown-dark mb-1 text-sm">
                          닉네임
                        </label>
                        <input
                          id="signup-username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-cozy-brown-light bg-cozy-cream font-body focus:border-cozy-sage focus:outline-none transition-colors"
                          placeholder="닉네임을 입력하세요"
                          required
                          autoComplete="username"
                        />
                      </div>
                      <div>
                        <label htmlFor="signup-email" className="block font-heading font-semibold text-cozy-brown-dark mb-1 text-sm">
                          이메일
                        </label>
                        <input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-cozy-brown-light bg-cozy-cream font-body focus:border-cozy-sage focus:outline-none transition-colors"
                          placeholder="이메일을 입력하세요"
                          required
                          autoComplete="email"
                        />
                      </div>
                      <div>
                        <label htmlFor="signup-password" className="block font-heading font-semibold text-cozy-brown-dark mb-1 text-sm">
                          비밀번호
                        </label>
                        <input
                          id="signup-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-cozy-brown-light bg-cozy-cream font-body focus:border-cozy-sage focus:outline-none transition-colors"
                          placeholder="비밀번호 (최소 6자)"
                          required
                          autoComplete="new-password"
                          minLength={6}
                        />
                      </div>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-60"
                        style={{
                          background: 'linear-gradient(180deg, var(--cozy-sage-light) 0%, var(--cozy-sage) 100%)',
                          borderColor: 'var(--cozy-sage-dark)',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            >
                              🐱
                            </motion.span>
                            가입 중...
                          </span>
                        ) : (
                          '회원가입'
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* 접기 버튼 */}
                <button
                  onClick={() => setShowEmailForm(false)}
                  className="w-full mt-4 py-2 text-cozy-brown hover:text-cozy-orange transition-colors font-body text-xs"
                >
                  접기
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {/* 안내 메시지 */}
        <motion.div
          className="mt-6 card py-4"
          style={{ background: 'linear-gradient(135deg, var(--cozy-cream) 0%, var(--cozy-orange-light) 50%, var(--cozy-cream) 100%)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl animate-bounce-soft">💡</span>
            <div>
              <p className="font-heading font-semibold text-cozy-brown-dark mb-1">빠른 시작</p>
              <p className="text-sm text-cozy-brown font-body">
                Google 계정으로 클릭 한 번에 시작하세요! 🚀
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}
