'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@ui/form';
import { Input, Button, ActionIcon, Title, Select } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { PiXBold } from 'react-icons/pi';
import { baseUrl } from '@/config/url';
import {
  CreateRoleInput,
  createRoleSchema,
} from '@/validators/create-role.schema';
// @ts-ignore
import Cookies from 'js-cookie';

interface FunctionList {
  uuid: string;
  name: string;
  createdAt: string;
}

interface PermissionResponse {
  uuid: string;
  write: boolean;
  edit: boolean;
  read: boolean;
  delete: boolean;
  createdAt: string;
  functinList: FunctionList;
}

interface Permission {
  modelUuid: string;
  write: boolean;
  edit: boolean;
  read: boolean;
  delete: boolean;
}

interface RoleDetails {
  uuid: string;
  name: string;
  permissions: PermissionResponse[];
}

interface EditRoleProps {
  roleUuid?: string;
  fetchRoles: any;
  fetchUsers: any;
}

export default function EditRole({
  roleUuid,
  fetchRoles,
  fetchUsers,
}: EditRoleProps) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const [models, setModels] = useState<FunctionList[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  );
  const [roleName, setRoleName] = useState<string>('');

  // Fetch models and role details from the API
  const fetchData = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      // Fetch models
      const modelsResponse = await axios.get<{ data: FunctionList[] }>(
        `${baseUrl}/function-lists/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setModels(modelsResponse.data.data);

      // Fetch role details
      const roleResponse = await axios.get<{ data: RoleDetails }>(
        `${baseUrl}/roles/find-one/${roleUuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const roleData = roleResponse.data.data;
      setRoleName(roleData.name);
      setSelectedPermissions(
        roleData.permissions.map((perm) => ({
          modelUuid: perm.functinList.uuid,
          write: perm.write,
          edit: perm.edit,
          read: perm.read,
          delete: perm.delete,
        }))
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roleUuid]);

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
      const response = await axios.put(
        `${baseUrl}/roles/update/${roleUuid}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchRoles();
        fetchUsers();
      }
      setSelectedPermissions([]);
      closeModal();
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (modelUuid: string) => {
    const existingPermission = selectedPermissions.find(
      (p) => (p.modelUuid as string) === modelUuid
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
    field: keyof Permission,
    value: boolean
  ) => {
    setSelectedPermissions((prev) =>
      prev.map((p) =>
        (p.modelUuid as string) === modelUuid ? { ...p, [field]: value } : p
      )
    );
  };

  const handleRemoveModel = (modelUuid: string) => {
    setSelectedPermissions((prev) =>
      prev.filter((p) => (p.modelUuid as string) !== modelUuid)
    );
  };

  return (
    <Form<CreateRoleInput>
      onSubmit={onSubmit}
      validationSchema={createRoleSchema}
      className="flex flex-grow flex-col gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, control, formState: { errors } }) => (
        <>
          <div className="flex items-center justify-between">
            <Title as="h4" className="font-semibold">
              Edit Role
            </Title>
            <ActionIcon size="sm" variant="text" onClick={closeModal}>
              <PiXBold className="h-auto w-5" />
            </ActionIcon>
          </div>
          <Input
            label="Role Name"
            placeholder="Role name"
            {...register('roleName')}
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
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
              Update Role
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
