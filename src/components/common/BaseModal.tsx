import { motion, AnimatePresence } from 'framer-motion';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: string;
  iconAnimation?: object;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function BaseModal({
  isOpen,
  onClose,
  icon,
  iconAnimation,
  title,
  subtitle,
  children,
}: BaseModalProps) {
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
            onClick={onClose}
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
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-cozy-cream border-2 border-cozy-brown-light hover:bg-cozy-orange-light transition-colors"
              aria-label="닫기"
            >
              <span className="text-cozy-brown font-bold">×</span>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <motion.span
                className="text-5xl block mb-3"
                animate={iconAnimation}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {icon}
              </motion.span>
              <h2 className="font-display text-2xl text-cozy-brown-dark">{title}</h2>
              {subtitle && (
                <p className="text-sm text-cozy-brown font-body mt-2">{subtitle}</p>
              )}
            </div>

            {/* Content */}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 성공 상태 UI 컴포넌트
interface SuccessStateProps {
  message: string;
  description?: string;
  onClose: () => void;
  buttonText?: string;
}

export function ModalSuccessState({
  message,
  description,
  onClose,
  buttonText = '확인',
}: SuccessStateProps) {
  return (
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
      <p className="font-heading font-semibold text-cozy-brown-dark mb-2">{message}</p>
      {description && (
        <p className="text-sm text-cozy-brown font-body mb-6">{description}</p>
      )}
      <motion.button
        onClick={onClose}
        className="w-full btn-cat"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {buttonText}
      </motion.button>
    </motion.div>
  );
}

// 에러 메시지 컴포넌트
interface ErrorMessageProps {
  message: string;
}

export function ModalErrorMessage({ message }: ErrorMessageProps) {
  return (
    <motion.div
      className="p-3 rounded-xl bg-red-50 border-2 border-red-300"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-red-700 text-sm font-body">{message}</p>
    </motion.div>
  );
}

// 로딩 버튼 컴포넌트
interface LoadingButtonProps {
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
  className?: string;
}

export function ModalLoadingButton({
  loading,
  loadingText,
  children,
  disabled,
  type = 'button',
  onClick,
  className = 'flex-1 btn-cat disabled:opacity-60',
}: LoadingButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
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
          {loadingText}
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
