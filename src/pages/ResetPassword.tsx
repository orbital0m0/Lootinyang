import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, supabaseHelpers } from '../services/supabase';

export function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
      }
      setChecking(false);
    });

    // Check if there's an existing session (user clicked the email link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      }
      setChecking(false);
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const validatePassword = () => {
    if (newPassword.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword()) return;

    setLoading(true);

    try {
      await supabaseHelpers.updatePassword(newPassword);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/auth');
  };

  if (checking) {
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
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.span
            className="text-6xl block mb-4"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          >
            🐱
          </motion.span>
          <p className="font-heading text-cozy-brown">확인 중...</p>
        </motion.div>
      </div>
    );
  }

  if (!isValidSession) {
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
          className="max-w-md w-full card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.span
            className="text-6xl block mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            ⚠️
          </motion.span>
          <h1 className="font-display text-2xl text-cozy-brown-dark mb-3">
            유효하지 않은 링크
          </h1>
          <p className="text-sm text-cozy-brown font-body mb-6">
            비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다.
            다시 비밀번호 찾기를 시도해주세요.
          </p>
          <motion.button
            onClick={handleGoToLogin}
            className="w-full btn-cat"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            로그인 페이지로
          </motion.button>
        </motion.div>
      </div>
    );
  }

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
        {/* Header */}
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
            <span className="text-7xl block">🔑</span>
            <motion.span
              className="absolute -top-2 -right-2 text-2xl"
              animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ✨
            </motion.span>
          </motion.div>
          <h1 className="font-display text-3xl text-cozy-brown-dark mt-4 mb-2">
            비밀번호 재설정
          </h1>
          <p className="text-cozy-brown font-body">새로운 비밀번호를 설정하세요</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              className="card text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center border-3 border-green-400"
                style={{ borderWidth: '3px' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <span className="text-4xl">✓</span>
              </motion.div>
              <h2 className="font-display text-xl text-cozy-brown-dark mb-2">
                비밀번호가 변경되었습니다!
              </h2>
              <p className="text-sm text-cozy-brown font-body mb-6">
                새 비밀번호로 로그인하세요.
              </p>
              <motion.button
                onClick={handleGoToLogin}
                className="w-full btn-cat"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="mr-2">🚀</span> 로그인하기
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div
                    className="p-3 rounded-xl bg-red-50 border-2 border-red-300"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                  >
                    <p className="text-red-700 text-sm font-body">{error}</p>
                  </motion.div>
                )}

                <div>
                  <label
                    htmlFor="new-password"
                    className="block font-heading font-semibold text-cozy-brown-dark mb-2"
                  >
                    <span className="mr-1" aria-hidden="true">🔐</span> 새 비밀번호
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-3 border-cozy-brown-light bg-cozy-cream font-body focus:border-cozy-orange focus:outline-none transition-colors"
                    style={{ borderWidth: '3px' }}
                    placeholder="새 비밀번호 (최소 6자)"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block font-heading font-semibold text-cozy-brown-dark mb-2"
                  >
                    <span className="mr-1" aria-hidden="true">🔐</span> 비밀번호 확인
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-3 border-cozy-brown-light bg-cozy-cream font-body focus:border-cozy-orange focus:outline-none transition-colors"
                    style={{ borderWidth: '3px' }}
                    placeholder="비밀번호 확인"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
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
                      변경 중...
                    </span>
                  ) : (
                    <>
                      <span className="mr-2">✓</span> 비밀번호 변경
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
