'use client';

import { useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input, Button, ActionIcon, Title, Text, Switch } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
// @ts-ignore
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { baseUrl } from '@/config/url';
import { TermFormInput } from '@/validators/create-terms.schema';

export default function CreateTerms({ fecthTerms }: any) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<TermFormInput> = async (data) => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    const termData = {
      name: data?.name,
      numberOfDays: data?.numberOfDays,
    };

    const response = await axios.post(
      `${baseUrl}/api/v1/payment-terms/create`,
      termData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      fecthTerms();
      closeModal();
      window.location.reload();
      toast.success(<Text>Payment Terms added successfully</Text>);
    } else {
      toast.error(<Text>Error adding payment term...</Text>);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TermFormInput>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-grow flex-col gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      <div className="flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Add A New Payment Term
        </Title>
        <ActionIcon size="sm" variant="text" onClick={closeModal}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>

      <Input
        label="Term Name"
        placeholder="Term name"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Number of days"
        placeholder="Number of days"
        {...register('numberOfDays')}
        error={errors.numberOfDays?.message}
      />
      <div className="flex items-center justify-end gap-4">
        <Button
          variant="outline"
          onClick={closeModal}
          className="w-full @xl:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full @xl:w-auto bg-[#a5a234]"
        >
          Create Terms
        </Button>
      </div>
    </form>
  );
}
