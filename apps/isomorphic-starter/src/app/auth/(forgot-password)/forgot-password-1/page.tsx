import ForgotPasswordForm from './forgot-password-form';
import UnderlineShape from '@components/shape/underline';
import Image from 'next/image';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';

export default function SignIn() {
  return (
    <AuthWrapperOne
      title={
        <>
          Reset your password!
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthWrapperOne>

  );
}
