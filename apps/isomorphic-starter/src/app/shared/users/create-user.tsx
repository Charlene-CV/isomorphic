'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@ui/form';
import { Input, Button, ActionIcon, Title, Select } from 'rizzui';
import { UserFormInput, userFormSchema } from '@/validators/create-user.schema';
import { useModal } from '@/app/shared/modal-views/use-modal';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';

export interface Role {
  uuid: string;
  name: string;
  createdAt: string;
}

export default function CreateUser({ fetchUsers }: any) {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      const response = await axios.get<{
        data: Role[];
      }>(`${baseUrl}/api/v1/roles/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const onSubmit: SubmitHandler<UserFormInput> = async (data) => {
    const formattedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      roleUuid: data.roleUuid,
    };
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      await axios.post(`${baseUrl}/api/v1/users/create`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReset({
        firstName: '',
        lastName: '',
        email: '',
        roleUuid: '',
      });
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error('Error during form submission:', error); // Log any errors
    }
  };

  return (
    <Form<UserFormInput>
      resetValues={reset}
      onSubmit={onSubmit}
      validationSchema={userFormSchema}
      className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, control, watch, formState: { errors } }) => {
        return (
          <>
            <div className="col-span-full flex items-center justify-between">
              <Title as="h4" className="font-semibold">
                Add a new User
              </Title>
              <ActionIcon size="sm" variant="text" onClick={closeModal}>
                <PiXBold className="h-auto w-5" />
              </ActionIcon>
            </div>
            <div>
              <Input
                label="First Name"
                placeholder="Enter user's first name"
                {...register('firstName')}
                className="col-span-full mb-5 text-xl md:col-span-1"
                error={errors.firstName?.message}
              />
              <Input
                label="Email"
                placeholder="Enter user's Email Address"
                className="col-span-full"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
            <div>
              <Input
                label="Last Name"
                placeholder="Enter user's last name"
                {...register('lastName')}
                className="col-span-full mb-5 text-xl md:col-span-1"
                error={errors.lastName?.message}
              />

              <Controller
                name="roleUuid"
                control={control}
                render={({ field: { name, onChange, value } }) => (
                  <Select
                    options={roles.map((role) => ({
                      value: role.uuid,
                      label: role.name,
                    }))}
                    value={value}
                    onChange={onChange}
                    name={name}
                    label="Role"
                    className="col-span-full md:col-span-1"
                    error={errors?.roleUuid?.message}
                    getOptionValue={(option) => option.value}
                    displayValue={(selectedValue) =>
                      roles.find((role) => role.uuid === selectedValue)?.name ??
                      ''
                    }
                    dropdownClassName="!z-[1]"
                  />
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
                Create User
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
