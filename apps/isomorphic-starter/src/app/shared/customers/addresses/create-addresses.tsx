'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@ui/form';
import { Input, Button, ActionIcon, Title, Select } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import {
  CustomerAddressesInput,
  customerAddressesSchema,
} from '@/validators/create-addresses.schema';
import { Accessorial } from '../../accessorials';
import { zodResolver } from '@hookform/resolvers/zod';

export default function CreateAddresses({ uuid, fetchAddresses }: any) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const [accessorials, setAccessorials] = useState<Accessorial[]>([]);
  const [accessorialUuids, setAccessorialUuids] = useState<any>([]);

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm<CustomerAddressesInput>({
    resolver: zodResolver(customerAddressesSchema),
    defaultValues: {
      company: '',
      contactName: '',
      phone: '',
      phoneExt: '',
      fax: '',
      email: '',
      businessHours: null,
      address: null,
      externalId: '',
      customBroker: '',
      bolInstruction: '',
      shipperNotes: '',
      consigneeNotes: '',
      customerUuid: uuid,
      accessorialUuids: [],
    },
  });

  const fetchAccessorials = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      const accessResponse = await axios.get<{ data: Accessorial[] }>(
        `${baseUrl}/api/v1/accessorials/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAccessorials(accessResponse?.data?.data);
    } catch (error) {
      console.error('Error fetching accessorials', error);
    }
  };

  useEffect(() => {
    fetchAccessorials();
  }, []);

  const onSubmit: SubmitHandler<CustomerAddressesInput> = async (data) => {
    setLoading(true);
    const formatData = {
      company: data?.company || null,
      contactName: data?.contactName || null,
      phone: data?.phone || null,
      phoneExt: data?.phoneExt || null,
      fax: data?.fax || null,
      email: data?.email || null,
      businessHours: data?.businessHours || null,
      address: data?.address || null,
      externalId: data?.externalId || null,
      customBroker: data?.customBroker || null,
      bolInstruction: data?.bolInstruction || null,
      shipperNotes: data?.shipperNotes || null,
      consigneeNotes: data?.consigneeNotes || null,
      customerUuid: uuid,
      accessorialUuids: data?.accessorialUuids || [],
    };

    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      await axios.post(
        `${baseUrl}/api/v1/customer-addresses/create`,
        formatData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      reset();
      fetchAddresses();
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
      <>
        <div className="col-span-full flex items-center justify-between">
          <Title as="h4" className="font-semibold">
            Add new Address
          </Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal}>
            <PiXBold className="h-auto w-5" />
          </ActionIcon>
        </div>
        <div>
          <Input
            label="Company"
            placeholder="Enter company's name"
            {...register('company')}
            className="col-span-full mb-5 text-xl md:col-span-1"
            error={errors.company?.message}
          />
          <Input
            label="Contact Name"
            placeholder="Enter Contact Name"
            className="col-span-full"
            {...register('contactName')}
            error={errors.contactName?.message}
          />
          <Input
            label="External ID"
            placeholder="Enter External ID"
            className="col-span-full"
            {...register('externalId')}
            error={errors.externalId?.message}
          />
          <Input
            label="Phone"
            placeholder="Enter Phone"
            className="col-span-full"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <Input
            label="Phone Ext"
            placeholder="Enter Phone Ext"
            className="col-span-full"
            {...register('phoneExt')}
            error={errors.phoneExt?.message}
          />
          <Input
            label="Email"
            placeholder="Enter Email"
            className="col-span-full"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Custom Broker"
            placeholder="Custom Broker"
            className="col-span-full"
            {...register('customBroker')}
            error={errors.customBroker?.message}
          />
          <Input
            label="Shipper Notes"
            placeholder="Shipper Notes"
            className="col-span-full"
            {...register('shipperNotes')}
            error={errors.shipperNotes?.message}
          />
          <Input
            label="Consignee Notes"
            placeholder="Consignee Notes"
            className="col-span-full"
            {...register('consigneeNotes')}
            error={errors.consigneeNotes?.message}
          />
          <Input
            label="Bol Instruction"
            placeholder="Bol Instruction"
            className="col-span-full"
            {...register('bolInstruction')}
            error={errors.bolInstruction?.message}
          />
        </div>
        <div>
          <Controller
            name="businessHours.open"
            control={control}
            render={({ field }) => (
              <Input
                label="Open Time"
                placeholder="Enter open time"
                {...field}
                type="time" // Set the input type to time
                // Format the Date to HH:mm if field.value is a Date
                value={
                  field.value instanceof Date
                    ? field.value.toTimeString().substring(0, 5) // Get HH:mm format
                    : field.value || undefined
                }
                className="col-span-full"
                error={errors?.businessHours?.open?.message}
                onChange={(e) => {
                  const value = e.target.value; // Get the time string (HH:mm)
                  const [hours, minutes] = value.split(':').map(Number);
                  // Create a new Date object, assuming today's date for the time
                  const dateValue = new Date();
                  dateValue.setHours(hours, minutes);
                  field.onChange(dateValue); // Update the field with the new Date
                }}
              />
            )}
          />
          <Controller
            name="businessHours.close"
            control={control}
            render={({ field }) => (
              <Input
                label="Open Time"
                placeholder="Enter close time"
                {...field}
                type="time" // Set the input type to time
                // Format the Date to HH:mm if field.value is a Date
                value={
                  field.value instanceof Date
                    ? field.value.toTimeString().substring(0, 5) // Get HH:mm format
                    : field.value || undefined
                }
                className="col-span-full"
                error={errors?.businessHours?.close?.message}
                onChange={(e) => {
                  const value = e.target.value; // Get the time string (HH:mm)
                  const [hours, minutes] = value.split(':').map(Number);
                  // Create a new Date object, assuming today's date for the time
                  const dateValue = new Date();
                  dateValue.setHours(hours, minutes);
                  field.onChange(dateValue); // Update the field with the new Date
                }}
              />
            )}
          />
          <Controller
            name="address.address"
            control={control}
            render={({ field }) => (
              <Input
                label="Address"
                placeholder="Enter address"
                {...field}
                value={field.value ?? ''}
                className="col-span-full"
                error={errors?.address?.address?.message}
              />
            )}
          />
          <Controller
            name="address.city"
            control={control}
            render={({ field }) => (
              <Input
                label="City"
                placeholder="Enter city"
                {...field}
                value={field.value ?? ''}
                className="col-span-full"
                error={errors?.address?.city?.message}
              />
            )}
          />
          <Controller
            name="address.state"
            control={control}
            render={({ field }) => (
              <Input
                label="State"
                placeholder="Enter state"
                {...field}
                value={field.value ?? ''}
                className="col-span-full"
                error={errors?.address?.state?.message}
              />
            )}
          />
          <Controller
            name="address.postal"
            control={control}
            render={({ field }) => (
              <Input
                label="Postal Code"
                placeholder="Enter postal code"
                {...field}
                value={field.value ?? ''}
                className="col-span-full"
                error={errors?.address?.postal?.message}
              />
            )}
          />
          <Controller
            name="address.country"
            control={control}
            render={({ field }) => (
              <Input
                label="Country"
                placeholder="Enter country"
                {...field}
                value={field.value ?? ''}
                className="col-span-full"
                error={errors?.address?.country?.message}
              />
            )}
          />
          <Controller
            name="address.latitude"
            control={control}
            render={({ field }) => (
              <Input
                label="Latitude"
                placeholder="Enter latitude"
                type="number"
                {...field}
                className="col-span-full"
                error={errors?.address?.latitude?.message}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            )}
          />
          <Controller
            name="address.longitude"
            control={control}
            render={({ field }) => (
              <Input
                label="Longitude"
                placeholder="Enter longitude"
                type="number"
                {...field}
                className="col-span-full"
                error={errors?.address?.longitude?.message}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="accessorialUuids"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  {...field}
                  label="Select Accessorials"
                  placeholder="Select accessorials"
                  options={accessorials.map((accessorial) => ({
                    value: accessorial.uuid,
                    label: accessorial.name,
                  }))}
                  value={accessorials.filter((accessorial) =>
                    field.value?.includes(accessorial.uuid)
                  )}
                  onChange={(selectedOption: any) => {
                    const selectedValues = Array.isArray(field.value)
                      ? [...field.value]
                      : [];
                    if (Array.isArray(selectedOption)) {
                      selectedOption.forEach((option: any) => {
                        if (!selectedValues.includes(option.value)) {
                          selectedValues.push(option.value);
                        }
                      });
                    } else if (
                      selectedOption?.value &&
                      !selectedValues.includes(selectedOption.value)
                    ) {
                      selectedValues.push(selectedOption.value);
                    }
                    setAccessorialUuids(selectedValues);
                    field.onChange(selectedValues);
                  }}
                  displayValue={() =>
                    field.value
                      ? field.value
                          .map(
                            (uuid: string) =>
                              accessorials.find(
                                (accessorial) => accessorial.uuid === uuid
                              )?.name
                          )
                          .filter(Boolean)
                          .join(', ') // Display accessorial names for selected UUIDs
                      : ''
                  }
                  error={errors.accessorialUuids?.message}
                />

                <div className="selected-accessorials mt-2 flex flex-wrap gap-2">
                  {field.value?.map((uuid: string) => {
                    const accessorial = accessorials.find(
                      (accessorial) => accessorial.uuid === uuid
                    );
                    return (
                      <div
                        key={uuid}
                        className="bg-gray-200 text-gray-800 py-1 px-2 rounded flex items-center"
                      >
                        {accessorial?.name}
                        <button
                          className="ml-2 text-red-500"
                          onClick={() => {
                            const updatedValues =
                              field.value &&
                              field.value.filter((id: string) => id !== uuid);
                            setAccessorialUuids(updatedValues || []);
                            field.onChange(updatedValues);
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
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
            Create Address
          </Button>
        </div>
      </>
    </form>
  );
}
