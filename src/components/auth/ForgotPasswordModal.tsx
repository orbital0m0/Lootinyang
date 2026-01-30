import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabaseHelpers } from '../../services/supabase';
import {
  BaseModal,
  ModalSuccessState,
  ModalErrorMessage,
  ModalLoadingButton,
} from '../common/BaseModal';

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
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      icon="🔑"
      iconAnimation={{ rotate: [0, -10, 10, 0] }}
      title="비밀번호 찾기"
      subtitle="가입한 이메일 주소를 입력하세요"
    >
      {success ? (
        <ModalSuccessState
          message="이메일이 전송되었습니다!"
          description={`비밀번호 재설정 링크가 ${email}로 전송되었습니다. 이메일을 확인해주세요.`}
          onClose={handleClose}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ModalErrorMessage message={error} />}

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
            <ModalLoadingButton
              type="submit"
              loading={loading}
              loadingText="전송 중..."
            >
              이메일 보내기
            </ModalLoadingButton>
          </div>
        </form>
      )}
    </BaseModal>
  );
}
