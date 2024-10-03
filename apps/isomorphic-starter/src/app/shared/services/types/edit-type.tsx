'use client';

import { useState, useEffect } from 'react';
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

interface EditTypesProps {
  typeUuid?: string;
  fetchTypes: any;
  fetchServices: any;
}

export default function EditType({
  typeUuid,
  fetchServices,
  fetchTypes,
}: EditTypesProps) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState<string>('');

  const fetchType = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get(
        `${baseUrl}/api/v1/service-types/find-one/${typeUuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const type = response?.data?.data;
      setName(type?.name);
    } catch (error) {
      console.error('Error fetching type:', error);
    }
  };

  useEffect(() => {
    fetchType();
  }, [typeUuid]);

  const onSubmit: SubmitHandler<TypeFormInput> = async (data) => {
    setLoading(true);

    const typeData = {
      name: data?.name,
    };

    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.put(
        `${baseUrl}/api/v1/service-types/update/${typeUuid}`,
        typeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchTypes();
        fetchServices();
        closeModal();
      }
    } catch (error) {
      console.error('Error updating type:', error);
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
              Edit Service Type
            </Title>
            <ActionIcon size="sm" variant="text" onClick={closeModal}>
              <PiXBold className="h-auto w-5" />
            </ActionIcon>
          </div>
          <Input
            label="Type Name"
            placeholder="Type Name"
            {...register('name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              Update Type
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
