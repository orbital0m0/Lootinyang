import { motion } from 'framer-motion';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  type?: 'app' | 'page';
}

export function ErrorFallback({ error, resetError, type = 'page' }: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = '/';
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
      role="alert"
      aria-live="assertive"
    >
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative inline-block mb-6"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <span className="text-8xl block">😿</span>
          <motion.span
            className="absolute -top-2 -right-2 text-3xl"
            animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            💫
          </motion.span>
        </motion.div>

        <h1 className="font-display text-3xl text-cozy-brown-dark mb-3">
          이런! 문제가 발생했어요
        </h1>
        <p className="text-cozy-brown font-body mb-6">
          걱정하지 마세요, 고양이가 해결할게요!
        </p>

        {import.meta.env.DEV && (
          <motion.div
            className="card mb-6 text-left"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-heading font-semibold text-cozy-brown-dark mb-2">
              오류 정보 (개발 모드):
            </p>
            <pre className="text-xs text-red-600 bg-red-50 p-3 rounded-xl overflow-auto max-h-32 border-2 border-red-200">
              {error.message}
            </pre>
          </motion.div>
        )}

        <div className="flex flex-col gap-3">
          <motion.button
            onClick={resetError}
            className="btn-cat text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">🔄</span> 다시 시도
          </motion.button>

          {type === 'page' && (
            <motion.button
              onClick={handleGoHome}
              className="btn-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">🏠</span> 홈으로
            </motion.button>
          )}
        </div>

        <motion.p
          className="text-sm text-cozy-brown-light mt-8 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          문제가 계속되면 페이지를 새로고침하거나 나중에 다시 시도해주세요.
        </motion.p>
      </motion.div>
    </div>
  );
}
