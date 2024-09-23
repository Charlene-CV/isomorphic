'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@ui/form';
import { Input, Button, ActionIcon, Title, Select } from 'rizzui';
import {
  CreateRoleInput,
  createRoleSchema,
} from '@/validators/create-role.schema';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { PiXBold } from 'react-icons/pi';
import { baseUrl } from '@/config/url';
import { useRouter } from 'next/navigation';
// @ts-ignore
import Cookies from 'js-cookie';

interface Model {
  uuid: string;
  name: string;
}

interface Permission {
  modelUuid: string;
  write: boolean;
  edit: boolean;
  read: boolean;
  delete: boolean;
}

export default function CreateRole({ fetchRoles }: any) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  );

  const router = useRouter();

  const fetchModels = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      const response = await axios.get<{ data: Model[] }>(
        `${baseUrl}/function-lists/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setModels(response.data.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const onSubmit: SubmitHandler<CreateRoleInput> = async (data) => {
    setLoading(true);

    const payload = {
      name: data.roleName,
      permissions: selectedPermissions.map((permission) => ({
        modelUuid: permission.modelUuid,
        write: permission.write,
        edit: permission.edit,
        read: permission.read,
        delete: permission.delete,
      })),
    };

    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      const response = await axios.post(`${baseUrl}/roles/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token to the headers
        },
      });
      console.log('Role created successfully', response.data);
      setSelectedPermissions([]);
      closeModal();
      if (response.status === 200) {
        fetchRoles();
      }
    } catch (error) {
      console.error('Error creating role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (modelUuid: string) => {
    const existingPermission = selectedPermissions.find(
      (p) => p.modelUuid === modelUuid
    );

    if (!existingPermission) {
      setSelectedPermissions((prev) => [
        ...prev,
        {
          modelUuid,
          write: false,
          edit: false,
          read: false,
          delete: false,
        },
      ]);
    }
  };

  const handlePermissionChange = (
    modelUuid: string,
    field: string,
    value: boolean
  ) => {
    setSelectedPermissions((prev) =>
      prev.map((p) =>
        p.modelUuid === modelUuid ? { ...p, [field]: value } : p
      )
    );
  };

  const handleRemoveModel = (modelUuid: string) => {
    setSelectedPermissions((prev) =>
      prev.filter((p) => p.modelUuid !== modelUuid)
    );
  };

  return (
    <Form<CreateRoleInput>
      onSubmit={onSubmit}
      validationSchema={createRoleSchema}
      className="flex flex-grow flex-col gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, control, watch, formState: { errors } }) => (
        <>
          <div className="flex items-center justify-between">
            <Title as="h4" className="font-semibold">
              Add a new Role
            </Title>
            <ActionIcon size="sm" variant="text" onClick={closeModal}>
              <PiXBold className="h-auto w-5" />
            </ActionIcon>
          </div>
          <Input
            label="Role Name"
            placeholder="Role name"
            {...register('roleName')}
            error={errors.roleName?.message}
          />

          <Controller
            control={control}
            name="model"
            render={({ field }) => (
              <Select
                {...field}
                label="Select Model"
                placeholder="Select a model"
                options={models.map((model) => ({
                  value: model.uuid,
                  label: model.name,
                }))}
                onChange={(value: any) => {
                  handleModelChange(value.value);
                }}
                error={errors.model?.message}
              />
            )}
          />

          {selectedPermissions.map((permission, index) => {
            const model = models.find(
              (model) => model.uuid === permission.modelUuid
            );
            return (
              <div key={index} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label>{model?.name}</label>
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={permission.write}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.modelUuid,
                          'write',
                          e.target.checked
                        )
                      }
                    />{' '}
                    Write
                    <input
                      type="checkbox"
                      checked={permission.edit}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.modelUuid,
                          'edit',
                          e.target.checked
                        )
                      }
                    />{' '}
                    Edit
                    <input
                      type="checkbox"
                      checked={permission.read}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.modelUuid,
                          'read',
                          e.target.checked
                        )
                      }
                    />{' '}
                    Read
                    <input
                      type="checkbox"
                      checked={permission.delete}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.modelUuid,
                          'delete',
                          e.target.checked
                        )
                      }
                    />{' '}
                    Delete
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveModel(permission.modelUuid)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

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
              Create Role
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
