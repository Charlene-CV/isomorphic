'use client';

import { useState } from 'react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { PiDesktop } from 'react-icons/pi';
import { Form } from '@ui/form';
import { Button, Password, Title, Text } from 'rizzui';
import cn from '@utils/class-names';
import { ProfileHeader } from '@/app/shared/account-settings/profile-settings';
import HorizontalFormBlockWrapper from '@/app/shared/account-settings/horiozontal-block';
import {
  passwordFormSchema,
  PasswordFormTypes,
} from '@/validators/password-settings.schema';
// @ts-ignore
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from '@/config/url';


export default function PasswordSettingsView({
  settings,
}: {
  settings?: PasswordFormTypes;
}) {

  type PassData = {
    currentPassword: string,
    newPassword: string,
    confirmedPassword: string
  }

  const [passData, setPassData] = useState<PassData>({
    currentPassword: '',
    newPassword: '',
    confirmedPassword: ''
  });

  const [isLoading, setLoading] = useState(false);
  const [reset, setReset] = useState({});

  const onSubmit: SubmitHandler<PasswordFormTypes> = async (data) => {
    setLoading(true);
    setPassData(data);
    try {
      const user: any = JSON.parse(Cookies.get("user"));
      const token = user.token;
      console.log({data: data})
      const response = await axios.put(
        `${baseUrl}/api/v1/users/change-password`,
        {
          oldPassword: data.currentPassword,
          password: data.newPassword,
          confPassword: data.confirmedPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response?.data?.data;
      if (response.status === 200) {
        toast.success(<Text>Password changed successfully!</Text>, { duration: 5000 });
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to change password: ", error);
    }
  };

  return (
    <>
      <Form<PasswordFormTypes>
        validationSchema={passwordFormSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        className="@container"
        useFormProps={{
          mode: 'onChange',
          defaultValues: {
            ...settings,
          },
        }}
      >
        {({ register, control, formState: { errors }, getValues }) => {
          return (
            <>
              {/* <ProfileHeader
                title="Olivia Rhye"
                description="olivia@example.com"
              /> */}

              <div className="mx-auto w-full max-w-screen-2xl">
                <HorizontalFormBlockWrapper
                  title="Current Password"
                  titleClassName="text-base font-medium"
                >
                  <Password
                    {...register('currentPassword')}
                    placeholder="Current Password"
                    error={errors.currentPassword?.message}
                  />
                </HorizontalFormBlockWrapper>

                <HorizontalFormBlockWrapper
                  title="New Password"
                  titleClassName="text-base font-medium"
                >
                  <Controller
                    control={control}
                    name="newPassword"
                    render={({ field: { onChange, value } }) => (
                      <Password
                        placeholder="New Password"
                        helperText={
                          getValues().newPassword.length < 8 &&
                          'Your password should consist of more than 8 characters.'
                        }
                        onChange={onChange}
                        error={errors.newPassword?.message}
                      />
                    )}
                  />
                </HorizontalFormBlockWrapper>

                <HorizontalFormBlockWrapper
                  title="Confirm New Password"
                  titleClassName="text-base font-medium"
                >
                  <Controller
                    control={control}
                    name="confirmedPassword"
                    render={({ field: { onChange, value } }) => (
                      <Password
                        placeholder="Confirm New Password"
                        onChange={onChange}
                        error={errors.confirmedPassword?.message}
                      />
                    )}
                  />
                </HorizontalFormBlockWrapper>

                <div className="mt-6 flex w-auto items-center justify-end gap-3">
                  <Button type="submit" variant="solid" isLoading={isLoading} className='bg-[#a5a234]'>
                    Update Password
                  </Button>
                </div>
              </div>
            </>
          );
        }}
      </Form>
      {/* <LoggedDevices className="mt-10" /> */}
    </>
  );
}
