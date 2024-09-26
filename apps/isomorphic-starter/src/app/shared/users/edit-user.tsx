'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, useForm } from 'react-hook-form';
import { Form } from '@ui/form';
import { Input, Button, ActionIcon, Title, Select, Switch } from 'rizzui';
import {
  UpdateUserInput,
  updateUserSchema,
} from '@/validators/create-user.schema';
import { useModal } from '@/app/shared/modal-views/use-modal';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import { User } from './index';
// @ts-ignore
import Cookies from 'js-cookie';

export interface Role {
  uuid: string;
  name: string;
  createdAt: string;
}

export interface EditUserProps {
  user: User;
  fetchUsers: any;
}

export default function EditUser({ user, fetchUsers }: EditUserProps) {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  //   const [users, setUsers] = useState<User[]>([]);
  const [firstName, setFirstName] = useState<string>(user?.firstName ?? '');
  const [lastName, setLastName] = useState<string>(user?.lastName ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [active, setActive] = useState<boolean>(user?.isActive ?? false);
  const [roleUuid, setRoleUuid] = useState<string>(user?.role?.uuid ?? '');

  const {
    control,
    register,
    formState: { errors },
    reset: resetForm,
  } = useForm<UpdateUserInput>({
    defaultValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      roleUuid: roleUuid || '',
      isActive: active || false,
    },
    mode: 'onBlur',
  });

  const fetchRoles = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      const response = await axios.get<{
        data: Role[];
      }>(`${baseUrl}/api/v1/roles/all`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setRoles(response.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get(
        `${baseUrl}/api/v1/users/find-one/${user?.uuid}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data.data;

      setFirstName(userData?.firstName);
      setLastName(userData?.lastName);
      setEmail(userData?.email);
      setActive(userData?.isActive);
      setRoleUuid(userData?.role?.uuid);

      resetForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        roleUuid: userData.role?.uuid || '',
        isActive: userData.isActive || false,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUser();
  }, []);

  const onSubmit: any = async (data: any) => {
    setLoading(true);

    const formattedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      roleUuid: data.roleUuid,
      isActive: data.isActive,
    };
    try {
      const userToken: any = JSON.parse(Cookies.get('user'));
      const token = userToken.token;

      await axios.put(`${baseUrl}/users/update/${user.uuid}`, formattedData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setReset({
        firstName: '',
        lastName: '',
        email: '',
        roleUuid: '',
        isActive: false,
      });
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error('Error during form submission:', error); // Log any errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<UpdateUserInput>
      resetValues={reset}
      onSubmit={onSubmit}
      validationSchema={updateUserSchema}
      className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, control, formState: { errors } }) => {
        return (
          <>
            <div className="col-span-full flex items-center justify-between">
              <Title as="h4" className="font-semibold">
                Edit User
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={errors.firstName?.message}
              />
              <Input
                label="Email"
                placeholder="Enter user's Email Address"
                className="col-span-full"
                {...register('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email?.message}
              />
            </div>
            <div>
              <Input
                label="Last Name"
                placeholder="Enter user's last name"
                {...register('lastName')}
                className="col-span-full mb-5 text-xl md:col-span-1"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={errors.lastName?.message}
              />

              <Controller
                name="roleUuid"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      label="Role"
                      placeholder="Select a role"
                      options={roles.map((role) => ({
                        value: roleUuid,
                        label: role.name,
                      }))}
                      value={roleUuid}
                      onChange={(value: any) => {
                        field.onChange(roleUuid);
                        setRoleUuid(roleUuid);
                      }}
                      name={field.name}
                      className="col-span-full md:col-span-1"
                      error={errors?.roleUuid?.message}
                      getOptionValue={(option) => option.value}
                      displayValue={(selectedValue) =>
                        roles.find((role) => role.uuid === selectedValue)
                          ?.name ?? ''
                      }
                      dropdownClassName="!z-[1]"
                    />
                  );
                }}
              />
            </div>
            <div>
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
                    <label>Status</label>
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
