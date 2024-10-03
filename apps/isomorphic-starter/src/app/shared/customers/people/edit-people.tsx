'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, useForm } from 'react-hook-form';
import { Form } from '@ui/form';
import { Input, Button, ActionIcon, Title, Switch } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import { People } from '.';
import {
  UpdatePeopleInput,
  updatePeopleSchema,
} from '@/validators/create-people.schema';

interface EditPeopleProps {
  uuid: string;
  people: People;
  fetchCustomerPeople: any;
}

export default function EditPeople({
  uuid,
  people,
  fetchCustomerPeople,
}: EditPeopleProps) {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState<string>(people?.firstName ?? '');
  const [lastName, setLastName] = useState<string>(people?.lastName ?? '');
  const [email, setEmail] = useState<string>(people?.email ?? '');
  const [job, setJob] = useState<string>(people?.job || '');
  const [notes, setNotes] = useState<string>(people?.notes || '');
  const [status, setStatus] = useState<string>(people?.status || '');
  const [active, setActive] = useState<boolean>(people?.isActive || false);
  const [report, setReport] = useState<boolean>(people?.sendReports || false);
  const [invoice, setInvoice] = useState<boolean>(
    people?.sendInvoices || false
  );
  const [portal, setPortal] = useState<boolean>(
    people?.hasPortalAccess || false
  );

  const {
    control,
    register,
    formState: { errors },
    reset: resetForm,
  } = useForm<UpdatePeopleInput>({
    defaultValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      job: job || '',
      notes: notes || '',
      isActive: active || false,
      sendInvoices: invoice || false,
      sendReports: report || false,
      hasPortalAccess: portal || false,
      status: status || '',
    },
    mode: 'onBlur',
  });

  const fetchPerson = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/people/find-one/${people?.uuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data?.data;

      setFirstName(data?.firstName);
      setLastName(data?.lastName);
      setEmail(data?.email);
      setJob(data?.job || '');
      setNotes(data?.notes || '');
      setStatus(data?.status || '');
      setActive(data?.isActive);
      setInvoice(data?.sendInvoices);
      setReport(data?.sendReports);
      setPortal(data?.hasPortalAccess);

      resetForm({
        firstName: data?.firstName || '',
        lastName: data?.lastName || '',
        email: data?.email || '',
        job: data?.job || '',
        notes: data?.notes || '',
        isActive: data?.isActive || false,
        sendInvoices: data?.sendInvoices || false,
        sendReports: data?.sendReports || false,
        hasPortalAccess: data?.hasPortalAccess || false,
        status: data?.status || '',
      });
    } catch (error) {
      console.error('Error fetching person:', error);
    }
  };

  useEffect(() => {
    fetchPerson();
  }, []);

  const onSubmit: any = async (data: any) => {
    setLoading(true);

    const formatData = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data?.email,
      job: data?.job,
      notes: data?.notes,
      isActive: data?.isActive,
      sendInvoices: data?.sendInvoices,
      sendReports: data?.sendReports,
      hasPortalAccess: data?.hasPortalAccess,
      status: data?.status,
      customerUuid: uuid,
    };

    const userToken: any = JSON.parse(Cookies.get('user'));
    const token = userToken.token;
    try {
      await axios.put(
        `${baseUrl}/api/v1/people/update/${people?.uuid}`,
        formatData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReset({
        firstName: '',
        lastName: '',
        email: '',
        job: '',
        notes: '',
        isActive: false,
        sendInvoices: false,
        sendReports: false,
        hasPortalAccess: false,
        status: '',
      });
      fetchCustomerPeople();
      closeModal();
    } catch (error) {
      console.error('Error during form submission:', error); // Log any errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<UpdatePeopleInput>
      resetValues={reset}
      onSubmit={onSubmit}
      validationSchema={updatePeopleSchema}
      className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, control, formState: { errors } }) => {
        return (
          <>
            <div className="col-span-full flex items-center justify-between">
              <Title as="h4" className="font-semibold">
                Edit People
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
                render={({ field: { value = portal, onChange } }) => (
                  <div className="flex items-center">
                    <Switch
                      checked={value}
                      onChange={onChange}
                      className="mr-2"
                    />
                    <label>Portal Access</label>
                  </div>
                )}
              />
              <Controller
                name="sendInvoices"
                control={control}
                render={({ field: { value = invoice, onChange } }) => (
                  <div className="flex items-center">
                    <Switch
                      checked={value}
                      onChange={onChange}
                      className="mr-2"
                    />
                    <label>Send Invoices</label>
                  </div>
                )}
              />
              <Controller
                name="sendReports"
                control={control}
                render={({ field: { value = report, onChange } }) => (
                  <div className="flex items-center">
                    <Switch
                      checked={value}
                      onChange={onChange}
                      className="mr-2"
                    />
                    <label>Send Reports</label>
                  </div>
                )}
              />
              <Controller
                name="isActive"
                control={control}
                render={({ field: { value = active, onChange } }) => (
                  <div className="flex items-center">
                    <Switch
                      checked={value}
                      onChange={onChange}
                      className="mr-2"
                    />
                    <label>Active</label>
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
                Save Changes
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
