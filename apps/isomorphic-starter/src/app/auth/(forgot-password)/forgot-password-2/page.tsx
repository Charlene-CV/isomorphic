import AuthWrapperTwo from '@/app/shared/auth-layout/auth-wrapper-two';
import ForgotPasswordForm from './forgot-password-form';

export default function ForgotPassword() {
  return (
    <AuthWrapperTwo title="Reset your Password">
      <ForgotPasswordForm />
    </AuthWrapperTwo>
  );
}
