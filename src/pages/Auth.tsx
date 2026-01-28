import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';
import { ForgotPasswordModal } from '../components/auth/ForgotPasswordModal';

export function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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

        {/* 탭 */}
        <motion.div
          className="flex mb-6 bg-cozy-cream rounded-2xl p-1 border-3 border-cozy-brown-light"
          style={{ borderWidth: '3px' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className={`flex-1 py-3 px-4 rounded-xl font-heading font-semibold transition-all ${
              isLogin
                ? 'bg-cozy-orange text-white shadow-md'
                : 'text-cozy-brown hover:bg-cozy-paper'
            }`}
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-1">🔑</span> 로그인
          </motion.button>
          <motion.button
            className={`flex-1 py-3 px-4 rounded-xl font-heading font-semibold transition-all ${
              !isLogin
                ? 'bg-cozy-sage text-white shadow-md'
                : 'text-cozy-brown hover:bg-cozy-paper'
            }`}
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-1">📝</span> 회원가입
          </motion.button>
        </motion.div>

        {/* 폼 */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                onSubmit={handleLogin}
                className="space-y-5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                aria-label="로그인 폼"
              >
                <div>
                  <label htmlFor="login-email" className="block font-heading font-semibold text-cozy-brown-dark mb-2">
                    <span className="mr-1" aria-hidden="true">📧</span> 이메일
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-3 border-cozy-brown-light bg-cozy-cream font-body focus:border-cozy-orange focus:outline-none transition-colors"
                    style={{ borderWidth: '3px' }}
                    placeholder="이메일을 입력하세요"
                    required
                    aria-required="true"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="block font-heading font-semibold text-cozy-brown-dark mb-2">
                    <span className="mr-1" aria-hidden="true">🔒</span> 비밀번호
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-3 border-cozy-brown-light bg-cozy-cream font-body focus:border-cozy-orange focus:outline-none transition-colors"
                    style={{ borderWidth: '3px' }}
                    placeholder="비밀번호를 입력하세요"
                    required
                    aria-required="true"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="mt-2 text-sm text-cozy-brown hover:text-cozy-orange transition-colors font-body"
                  >
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-cat text-lg disabled:opacity-60"
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
                    <>
                      <span className="mr-2">🚀</span> 로그인
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                onSubmit={handleSignUp}
                className="space-y-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                aria-label="회원가입 폼"
              >
                <div>
                  <label htmlFor="signup-username" className="block font-heading font-semibold text-cozy-brown-dark mb-2">
                    <span className="mr-1" aria-hidden="true">👤</span> 닉네임
                  </label>
                  <input
                    id="signup-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-3 border-cozy-brown-light bg-cozy-cream font-body focus:border-cozy-sage focus:outline-none transition-colors"
                    style={{ borderWidth: '3px' }}
                    placeholder="닉네임을 입력하세요"
                    required
                    aria-required="true"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block font-heading font-semibold text-cozy-brown-dark mb-2">
                    <span className="mr-1" aria-hidden="true">📧</span> 이메일
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-3 border-cozy-brown-light bg-cozy-cream font-body focus:border-cozy-sage focus:outline-none transition-colors"
                    style={{ borderWidth: '3px' }}
                    placeholder="이메일을 입력하세요"
                    required
                    aria-required="true"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block font-heading font-semibold text-cozy-brown-dark mb-2">
                    <span className="mr-1" aria-hidden="true">🔒</span> 비밀번호
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-3 border-cozy-brown-light bg-cozy-cream font-body focus:border-cozy-sage focus:outline-none transition-colors"
                    style={{ borderWidth: '3px' }}
                    placeholder="비밀번호를 입력하세요 (최소 6자)"
                    required
                    aria-required="true"
                    aria-describedby="password-hint"
                    autoComplete="new-password"
                    minLength={6}
                  />
                  <p id="password-hint" className="sr-only">비밀번호는 최소 6자 이상이어야 합니다</p>
                </div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-lg disabled:opacity-60"
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
                    <>
                      <span className="mr-2">🎉</span> 회원가입
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 안내 메시지 */}
        <motion.div
          className="mt-6 card py-4"
          style={{ background: 'linear-gradient(135deg, var(--cozy-cream) 0%, var(--cozy-orange-light) 50%, var(--cozy-cream) 100%)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl animate-bounce-soft">💡</span>
            <div>
              <p className="font-heading font-semibold text-cozy-brown-dark mb-1">시작하기</p>
              <p className="text-sm text-cozy-brown font-body">
                처음이신가요? 회원가입하고 고양이와 함께 습관을 만들어보세요! 🐱
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