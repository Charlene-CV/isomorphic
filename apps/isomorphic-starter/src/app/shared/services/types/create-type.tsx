'use client';

import { useState } from 'react';
import axios from 'axios';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@ui/form';
import { Input, Button, ActionIcon, Title } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { PiXBold } from 'react-icons/pi';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import {
  TypeFormInput,
  typeFormSchema,
} from '@/validators/create-serviceType.schema';

export default function CreateType({ fetchTypes }: any) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<TypeFormInput> = async (data) => {
    setLoading(true);

    const typeData = {
      name: data?.name,
    };

    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.post(
        `${baseUrl}/api/v1/service-types/create`,
        typeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        closeModal();
        fetchTypes();
      }
    } catch (error) {
      console.error('Error creating service type:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<TypeFormInput>
      onSubmit={onSubmit}
      validationSchema={typeFormSchema}
      className="flex flex-grow flex-col gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, formState: { errors } }) => (
        <>
          <div className="flex items-center justify-between">
            <Title as="h4" className="font-semibold">
              Add New Service Type
            </Title>
            <ActionIcon size="sm" variant="text" onClick={closeModal}>
              <PiXBold className="h-auto w-5" />
            </ActionIcon>
          </div>
          <Input
            label="Type Name"
            placeholder="Type Name"
            {...register('name')}
            error={errors.name?.message}
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
              className="w-full @xl:w-auto"
            >
              Create Type
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
