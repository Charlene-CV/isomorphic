'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Checkbox, Password, Button, Input, Text } from 'rizzui';
import { Form } from '@ui/form';
import { routes } from '@/config/routes';
import { loginSchema, LoginSchema } from '@/validators/login.schema';
import axios from 'axios';
// @ts-ignore
import Cookies from 'js-cookie';

const initialValues: LoginSchema = {
  email: '',
  password: '',
  rememberMe: true,
};

export default function SignInForm() {
  //TODO: why we need to reset it here
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      const content = {
        email: data?.email,
        password: data?.password
      };
      const response = await axios.post('http://192.168.0.146:8080/api/v1/auth/logIn', content);
      const responseData = response?.data?.data;
      if (responseData?.token) {
        Cookies.set('user', JSON.stringify({
          id: responseData.user.uuid,
          name: `${responseData.user.firstName} ${responseData.user.lastName}`,
          email: responseData.user.email,
          token: responseData.token,
        }), { expires: 7 });
        const user = JSON.parse(Cookies.get('user'));
        if (user && response.status === 200) {
          toast.success(<Text>Signing in...</Text>, { duration: 5000 });
          reset();
          router.push('/profile');
        } else {
          router.push('/signin');
        }
      }
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="email"
              size="lg"
              label="Email"
              placeholder="Enter your email"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('email')}
              error={errors.email?.message}
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex items-center justify-between pb-2">
              <Checkbox
                {...register('rememberMe')}
                label="Remember Me"
                className="[&>label>span]:font-medium"
              />
              <Link
                href={routes.auth.forgotPassword1}
                className="h-auto p-0 text-sm font-semibold text-blue underline transition-colors hover:text-gray-900 hover:no-underline"
              >
                Forgot Password?
              </Link>
            </div>
            <Button className="w-full" type="submit" size="lg" style={{ color: "#a5a234" }}
            >
              <span>Sign in</span>{' '}
              <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
            </Button>
          </div>
        )}
      </Form>
    </>
  );
}
