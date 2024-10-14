'use client';

import { useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input, Button, ActionIcon, Title, Switch } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import {
  CreatePeopleInput,
  createPeopleSchema,
} from '@/validators/create-people.schema';
import { zodResolver } from '@hookform/resolvers/zod';

export default function CreatePeople({ uuid, fetchCustomerPeople }: any) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm<CreatePeopleInput>({
    resolver: zodResolver(createPeopleSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      job: '',
      notes: '',
      hasPortalAccess: false,
      sendInvoices: false,
      sendReports: false,
      customerUuid: uuid,
    },
  });

  const onSubmit: SubmitHandler<CreatePeopleInput> = async (data) => {
    setLoading(true);

    const formatData = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data?.email,
      job: data?.job || '',
      notes: data?.notes || '',
      hasPortalAccess: data?.hasPortalAccess || false,
      sendInvoices: data?.sendInvoices || false,
      sendReports: data?.sendReports || false,
      customerUuid: uuid,
    };

    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      await axios.post(`${baseUrl}/api/v1/people/create`, formatData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      reset();

      fetchCustomerPeople();
      closeModal();
    } catch (error) {
      console.error('Error during form submission:', error); // Log any errors
    } finally {
      setLoading(false); // always stop loading state
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
            Add People
          </Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal}>
            <PiXBold className="h-auto w-5" />
          </ActionIcon>
        </div>
        <div>
          <Input
            label="First Name"
            placeholder="Enter first name"
            {...register('firstName')}
            className="col-span-full mb-5 text-xl md:col-span-1"
            error={errors.firstName?.message}
          />
          <Input
            label="Email"
            placeholder="Enter Email Address"
            className="col-span-full"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>
        <div>
          <Input
            label="Last Name"
            placeholder="Enter last name"
            {...register('lastName')}
            className="col-span-full mb-5 text-xl md:col-span-1"
            error={errors.lastName?.message}
          />

          <Input
            label="Job"
            placeholder="Enter job"
            {...register('job')}
            className="col-span-full mb-5 text-xl md:col-span-1"
            error={errors.job?.message}
          />

          <Input
            label="Notes"
            placeholder="Enter notes"
            {...register('notes')}
            className="col-span-full mb-5 text-xl md:col-span-1"
            error={errors.notes?.message}
          />
        </div>
        <div>
          <Controller
            name="hasPortalAccess"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex items-center">
                <Switch checked={value} onChange={onChange} className="mr-2" />
                <label>Portal Access</label>
              </div>
            )}
          />
          <Controller
            name="sendInvoices"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex items-center">
                <Switch checked={value} onChange={onChange} className="mr-2" />
                <label>Send Invoices</label>
              </div>
            )}
          />
          <Controller
            name="sendReports"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex items-center">
                <Switch checked={value} onChange={onChange} className="mr-2" />
                <label>Send Reports</label>
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
            Create People
          </Button>
        </div>
      </>
    </form>
  );
}
