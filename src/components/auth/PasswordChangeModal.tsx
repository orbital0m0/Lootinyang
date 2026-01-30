import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabaseHelpers } from '../../services/supabase';
import {
  BaseModal,
  ModalSuccessState,
  ModalErrorMessage,
  ModalLoadingButton,
} from '../common/BaseModal';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      icon="🔒"
      iconAnimation={{ scale: [1, 1.1, 1] }}
      title="비밀번호 변경"
      subtitle="새로운 비밀번호를 입력하세요"
    >
      {success ? (
        <ModalSuccessState
          message="비밀번호가 변경되었습니다!"
          description="다음 로그인부터 새 비밀번호를 사용하세요."
          onClose={handleClose}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ModalErrorMessage message={error} />}

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
              loadingText="변경 중..."
            >
              변경하기
            </ModalLoadingButton>
          </div>
        </form>
      )}
    </BaseModal>
  );
}
