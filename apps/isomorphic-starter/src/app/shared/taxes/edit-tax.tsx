'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input, Button, ActionIcon, Title, Text, Modal } from 'rizzui';
import { TaxFormInput, taxFormSchema } from '@/validators/taxes.schema';
import { useModal } from '@/app/shared/modal-views/use-modal';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import FormGroup from '../form-group';

export default function EditTax({ fetchTaxes, taxData } : any) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaxFormInput>({
    defaultValues: {
      name: taxData?.name || '',
      origin: taxData?.origin || '',
      destination: taxData?.destination || '',
      tax: taxData?.tax || 0,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (taxData) {
      reset({
        name: taxData?.name,
        origin: taxData?.origin,
        destination: taxData?.destination,
        tax: taxData?.tax,
      });
    }
  }, [taxData, reset]);

  const onSubmit: SubmitHandler<TaxFormInput> = async (data) => {
    const formattedData = {
      name: data?.name,
      origin: data?.origin,
      destination: data?.destination,
      tax: data?.tax,
    };
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      const response = await axios.put(`${baseUrl}/api/v1/taxes/update/${taxData.uuid}`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        fetchTaxes();
        closeModal();
        toast.success(<Text>Tax edited successfully!</Text>);
      } else {
        toast.error(<Text>Error editing tax...</Text>);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 p-6">
          <>
            <div className="flex items-center justify-between">
              <Title as="h4" className="font-semibold">
                Edit Tax
              </Title>
              <ActionIcon size="sm" variant="text" onClick={closeModal}>
                <PiXBold className="h-auto w-5" />
              </ActionIcon>
            </div>

            <FormGroup title="Tax Details" className="space-y-5">
              <Input
                label="Name"
                placeholder="Enter tax name"
                {...register('name')}
                className="w-full"
                error={errors.name?.message}
              />

              <Input
                label="Origin"
                placeholder="Enter origin"
                {...register('origin')}
                className="w-full"
                error={errors.origin?.message}
              />

              <Input
                label="Destination"
                placeholder="Enter destination"
                {...register('destination')}
                className="w-full"
                error={errors.destination?.message}
              />

              <Input
                label="Tax Amount"
                placeholder="Enter tax amount"
                {...register('tax', {
                  setValueAs: (value) => parseFloat(value) || 0,
                })}
                className="w-full"
                error={errors.tax?.message}
              />
            </FormGroup>

            <div className="flex justify-end gap-4 mt-5">
              <Button variant="outline" onClick={closeModal} className="w-full md:w-auto">
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
                Edit Tax
              </Button>
            </div>
          </>
        </form>
  );
}
