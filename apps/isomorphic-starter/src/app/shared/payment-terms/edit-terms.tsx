'use client';

import { useState, useEffect } from 'react';
import { PiCheckBold, PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { ActionIcon, Title, Button, Input, Switch, Text } from 'rizzui';
import axios from 'axios';
// @ts-ignore
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { baseUrl } from '@/config/url';
import { TermFormInput } from '@/validators/create-terms.schema';

interface EditTermProps {
  term: TermFormInput;
  fetchTerms: any;
}

export default function EditTerm({ term, fetchTerms }: EditTermProps) {
  const defaultValues = {
    name: term?.name || '',
    numberOfDays: term?.numberOfDays || 0,
  };
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useForm<TermFormInput>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset({ name: term?.name, numberOfDays: term?.numberOfDays });
  }, [reset, term]);

  const onSubmit: SubmitHandler<TermFormInput> = async (data) => {
    const termData = {
      name: data?.name,
      numberOfDays: data?.numberOfDays,
    };

    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;

    const response = await axios.put(
      `${baseUrl}/api/v1/payment-terms/update/${term?.uuid}`,
      termData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response?.status === 200) {
      fetchTerms();
      closeModal();
      // window.location.reload();
      toast.success(<Text>Payment Terms updated successfully!</Text>);
    } else {
      toast.error(<Text>Error updating payment term.</Text>, {
        duration: 5000,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-grow flex-col gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      <div className="flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Edit Payment Term
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
          Save
        </Button>
      </div>
    </form>
  );
}
