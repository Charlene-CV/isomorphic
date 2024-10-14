'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input, Button, ActionIcon, Title, Select, Switch } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import {
  CreateTariffInput,
  createTariffSchema,
} from '@/validators/tariff-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { TariffTypes } from '@/config/constants';
import { Customer } from '../customers';

export default function CreateTariff({ fetchTariffs }: any) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm<CreateTariffInput>({
    resolver: zodResolver(createTariffSchema),
    defaultValues: {
      name: '',
      type: '',
      customerUuid: '',
    },
  });

  const fetchCustomers = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      const response = await axios.get<{ data: Customer[] }>(
        `${baseUrl}/api/v1/customers/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(response.data?.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const onSubmit: SubmitHandler<CreateTariffInput> = async (data) => {
    setLoading(true);
    const formattedData = {
      ...data,
      customerUuid: data?.customerUuid,
    };

    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      await axios.post(`${baseUrl}/api/v1/tariffs/create`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      reset();

      fetchTariffs();
      closeModal();
    } catch (error) {
      console.error('Error during form submission:', error); // Log any errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      <div className="col-span-full flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Add new Tariff
        </Title>
        <ActionIcon size="sm" variant="text" onClick={closeModal}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
      <div>
        <Input
          label="Name"
          placeholder="Enter tariff's name"
          {...register('name')}
          className="col-span-full mb-5 text-xl md:col-span-1"
          error={errors.name?.message}
        />
      </div>
      <div>
        <Controller
          name="customerUuid"
          control={control}
          render={({ field: { name, onChange, value } }) => (
            <Select
              options={customers.map((customer) => ({
                value: customer.uuid,
                label: customer.name,
              }))}
              value={value}
              onChange={onChange}
              name={name}
              label="Customer"
              className="col-span-full md:col-span-1"
              error={errors?.customerUuid?.message}
              getOptionValue={(option) => option.value}
              displayValue={(selectedValue) =>
                customers.find((customer) => customer.uuid === selectedValue)
                  ?.name ?? ''
              }
              dropdownClassName="!z-[1]"
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="type"
          control={control}
          render={({ field: { name, onChange, value } }) => {
            // Create options from the enum
            const options = Object.entries(TariffTypes).map(([key, label]) => ({
              value: label, // Use the label as the value
              label: label, // Use the label for display
            }));

            // Find the selected option based on the current value
            const selectedOption =
              options.find((option) => option.value === value) || null;

            return (
              <Select
                options={options} // Provide the options
                value={selectedOption} // Set the selected option
                onChange={
                  (selectedOption: any) => onChange(selectedOption.value) // Pass the enum label to onChange
                }
                name={name}
                label="Tariff Type"
                className="col-span-full md:col-span-1"
                error={errors?.type?.message}
                dropdownClassName="!z-[1]"
              />
            );
          }}
        />
      </div>

      <div className="col-span-full flex items-center justify-end gap-4">
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
          Create Tariff
        </Button>
      </div>
    </form>
  );
}
