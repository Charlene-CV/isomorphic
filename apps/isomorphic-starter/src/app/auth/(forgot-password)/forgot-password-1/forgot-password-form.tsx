'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Text, Input, Password } from 'rizzui';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@ui/form';
import { routes } from '@/config/routes';
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from '@/validators/reset-password.schema';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const initialValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

export default function ForgotPasswordForm() {
  const { reset } = useForm();
  const router = useRouter();

  const onSubmit: SubmitHandler<ResetPasswordSchema> = async (data) => {
    try {
      const response = await axios.post('http://192.168.0.146:8080/api/v1/auth/resetPass',
        {
          email: data?.email,
          password: data?.password,
          confPass: data?.confirmPassword
        }
      );
      console.log(response.status);
      if (response.status === 200) {
        reset();
        router.push('/signin');
      } else {
        reset();
        router.push('/auth/forgot-password-1');
      }
    } catch (error) {
      console.error("Error resetting password: ", error);
    }
  };

  return (
    <>
      <Form<ResetPasswordSchema>
        validationSchema={resetPasswordSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          mode: 'onChange',
          defaultValues: initialValues,
        }}
        className="pt-1.5"
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-6">
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
            <Password
              label="Confirm Password"
              placeholder="Enter confirm password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            <Button className="mt-2 w-full" type="submit" size="lg" style={{ color: "#a5a234" }}>
              Reset Password
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center text-[15px] leading-loose text-gray-500 lg:mt-8 lg:text-start xl:text-base">
        Don’t want to reset your password?{' '}
        <Link
          href={routes.auth.signIn1}
          className="font-bold text-gray-700 transition-colors hover:text-blue"
        >
          Sign In
        </Link>
      </Text>
    </>
  );
}
