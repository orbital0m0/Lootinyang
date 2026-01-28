import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseHelpers } from '../../services/supabase';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await supabaseHelpers.resetPasswordForEmail(email);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '이메일 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-cozy-cream border-2 border-cozy-brown-light hover:bg-cozy-orange-light transition-colors"
              aria-label="닫기"
            >
              <span className="text-cozy-brown font-bold">×</span>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <motion.span
                className="text-5xl block mb-3"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              >
                🔑
              </motion.span>
              <h2 className="font-display text-2xl text-cozy-brown-dark">비밀번호 찾기</h2>
              <p className="text-sm text-cozy-brown font-body mt-2">
                가입한 이메일 주소를 입력하세요
              </p>
            </div>

            {success ? (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center border-3 border-green-400"
                  style={{ borderWidth: '3px' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <span className="text-3xl">✓</span>
                </motion.div>
                <p className="font-heading font-semibold text-cozy-brown-dark mb-2">
                  이메일이 전송되었습니다!
                </p>
                <p className="text-sm text-cozy-brown font-body mb-6">
                  비밀번호 재설정 링크가 <strong>{email}</strong>로 전송되었습니다.
                  이메일을 확인해주세요.
                </p>
                <motion.button
                  onClick={handleClose}
                  className="w-full btn-cat"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  확인
                </motion.button>
              </motion.div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div
                    className="p-3 rounded-xl bg-red-50 border-2 border-red-300"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-red-700 text-sm font-body">{error}</p>
                  </motion.div>
                )}

                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block font-heading font-semibold text-cozy-brown-dark mb-2"
                  >
                    <span className="mr-1" aria-hidden="true">📧</span> 이메일
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-3 border-cozy-brown-light bg-cozy-cream font-body focus:border-cozy-orange focus:outline-none transition-colors"
                    style={{ borderWidth: '3px' }}
                    placeholder="이메일을 입력하세요"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 btn-secondary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    취소
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-cat disabled:opacity-60"
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
                        전송 중...
                      </span>
                    ) : (
                      '이메일 보내기'
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
