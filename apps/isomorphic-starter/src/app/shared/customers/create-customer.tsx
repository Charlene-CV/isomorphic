'use client';

import { useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input, Button, ActionIcon, Title, Select, Switch } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import {
  CreateCustomerInput,
  createCustomerSchema,
} from '@/validators/create-customer.schema';
import { BillingOptionsEnum, CustomerTypesEnum } from '@/config/constants';
import { zodResolver } from '@hookform/resolvers/zod';

export default function CreateCustomer({ fetchCustomers }: any) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: '',
      shortCode: '',
      customerType: undefined,
      billingOption: undefined,
      requireQuote: false,
      currency: 'CAD',
      isActive: false,
      addresses: {
        address: '',
        city: '',
        state: '',
        postal: '',
        country: '',
        latitude: undefined,
        longitude: undefined,
      },
    },
  });

  const onSubmit: SubmitHandler<CreateCustomerInput> = async (data) => {
    setLoading(true);
    const formattedData = {
      ...data,
      requireQuote: data?.requireQuote || false,
      currency: data?.currency || 'CAD',
      isActive: data?.isActive || false,
    };

    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      await axios.post(`${baseUrl}/api/v1/customers/create`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      reset();

      fetchCustomers();
      closeModal();
    } catch (error) {
      console.error('Error during form submission:', error); // Log any errors
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      <div className="col-span-full flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Add a new Customer
        </Title>
        <ActionIcon size="sm" variant="text" onClick={closeModal}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
      <div>
        <Input
          label="Name"
          placeholder="Enter customer's name"
          {...register('name')}
          className="col-span-full mb-5 text-xl md:col-span-1"
          error={errors.name?.message}
        />
      </div>
      <div>
        <Input
          label="Short Code"
          placeholder="Enter user's Short Code Address"
          className="col-span-full"
          {...register('shortCode')}
          error={errors.shortCode?.message}
        />
      </div>
      <div>
        <Controller
          name="customerType"
          control={control}
          render={({ field: { name, onChange, value } }) => {
            // Create options from the enum
            const options = Object.entries(CustomerTypesEnum).map(
              ([key, label]) => ({
                value: label, // Use the label as the value
                label: label, // Use the label for display
              })
            );

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
                label="Customer Type"
                className="col-span-full md:col-span-1"
                error={errors?.customerType?.message}
                dropdownClassName="!z-[1]"
              />
            );
          }}
        />
      </div>
      <div>
        <Controller
          name="billingOption"
          control={control}
          render={({ field: { name, onChange, value } }) => {
            // Create options from the enum
            const options = Object.entries(BillingOptionsEnum).map(
              ([key, label]) => ({
                value: label, // Use the label as the value
                label: label, // Use the label for display
              })
            );

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
                label="Billing Option"
                className="col-span-full md:col-span-1"
                error={errors?.billingOption?.message}
                dropdownClassName="!z-[1]"
              />
            );
          }}
        />
      </div>
      <div>
        <Controller
          name="addresses.address"
          control={control}
          render={({ field }) => (
            <Input
              label="Address"
              placeholder="Enter address"
              {...field}
              value={field.value ?? ''}
              className="col-span-full"
              error={errors?.addresses?.address?.message}
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="addresses.city"
          control={control}
          render={({ field }) => (
            <Input
              label="City"
              placeholder="Enter city"
              {...field}
              value={field.value ?? ''}
              className="col-span-full"
              error={errors?.addresses?.city?.message}
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="addresses.state"
          control={control}
          render={({ field }) => (
            <Input
              label="State"
              placeholder="Enter state"
              {...field}
              value={field.value ?? ''}
              className="col-span-full"
              error={errors?.addresses?.state?.message}
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="addresses.postal"
          control={control}
          render={({ field }) => (
            <Input
              label="Postal Code"
              placeholder="Enter postal code"
              {...field}
              value={field.value ?? ''}
              className="col-span-full"
              error={errors?.addresses?.postal?.message}
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="addresses.country"
          control={control}
          render={({ field }) => (
            <Input
              label="Country"
              placeholder="Enter country"
              {...field}
              value={field.value ?? ''}
              className="col-span-full"
              error={errors?.addresses?.country?.message}
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="addresses.latitude"
          control={control}
          render={({ field }) => (
            <Input
              label="Latitude"
              placeholder="Enter latitude"
              type="number"
              {...field}
              className="col-span-full"
              error={errors?.addresses?.latitude?.message}
              onChange={(e) => field.onChange(e.target.valueAsNumber)}
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="addresses.longitude"
          control={control}
          render={({ field }) => (
            <Input
              label="Longitude"
              placeholder="Enter longitude"
              type="number"
              {...field}
              className="col-span-full"
              error={errors?.addresses?.longitude?.message}
              onChange={(e) => field.onChange(e.target.valueAsNumber)}
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="isActive"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="flex items-center">
              <Switch
                checked={value} // Ensure it reflects the current state
                onChange={onChange} // Bind the onChange handler
                className="mr-2"
              />
              <label>Active</label>
            </div>
          )}
        />
        <Controller
          name="requireQuote"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="flex items-center">
              <Switch
                checked={value} // Ensure it reflects the current state
                onChange={onChange} // Bind the onChange handler
                className="mr-2"
              />
              <label>Require Quote</label>
            </div>
          )}
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
          Create Customer
        </Button>
      </div>
    </form>
  );
}
