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
import { CreateServiceInput } from '@/validators/create-service.schema';
import { ServiceConnectionEnum } from '@/config/constants';

interface Type {
  uuid: string;
  name: string;
}

interface EditServiceProps {
  service: any;
  fetchServices: any;
}

export default function EditService({
  service,
  fetchServices,
}: EditServiceProps) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const [active, setActive] = useState<boolean>(false);
  const [types, setTypes] = useState<Type[]>([]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateServiceInput>({
    defaultValues: {
      connection: service?.connection || '',
      isActive: service?.isActive || false,
      markup: service?.markup || null,
      maxMarkup: service?.maxMarkup || null,
      minMarkup: service?.minMarkup || null,
      name: service?.name || '',
      offering: service?.offering || '',
      typeUuid: service?.serviceType?.uuid || '',
    },
    mode: 'onBlur',
  });

  const fetchTypes = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get(`${baseUrl}/api/v1/service-types/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTypes(response?.data?.data);
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  useEffect(() => {
    fetchTypes();
    console.log('service', service);
    if (service) {
      reset({
        connection: service?.connection || '',
        isActive: service?.isActive || false,
        markup: service?.markup || null,
        maxMarkup: service?.maxMarkup || null,
        minMarkup: service?.minMarkup || null,
        name: service?.name || '',
        offering: service?.offering || '',
        typeUuid: service?.type?.uuid || '',
      });
    }
  }, []);

  const onSubmit: SubmitHandler<CreateServiceInput> = async (data) => {
    setLoading(true);
    const formattedData = {
      name: data?.name,
      connection: data?.connection,
      isActive: data?.isActive,
      markup: data?.markup,
      maxMarkup: data?.maxMarkup,
      minMarkup: data?.minMarkup,
      offering: data?.offering,
      typeUuid: data?.typeUuid,
    };

    try {
      const userToken: any = JSON.parse(Cookies.get('user'));
      const token = userToken.token;

      await axios.put(
        `${baseUrl}/api/v1/services/update/${service?.uuid}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchServices();
      closeModal();
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setLoading(false);
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
            Edit Service
          </Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal}>
            <PiXBold className="h-auto w-5" />
          </ActionIcon>
        </div>

        <div>
          <Input
            label="Name"
            placeholder="Name"
            {...register('name')}
            className="col-span-full mb-5 text-xl md:col-span-1"
            error={errors.name?.message}
          />
          <Input
            label="Offering"
            placeholder="Offering"
            {...register('offering')}
            error={errors.offering?.message}
          />
        </div>

        <div>
          <Controller
            name="connection"
            control={control}
            render={({ field: { name, onChange, value } }) => {
              // Create options from the enum
              const options = Object.entries(ServiceConnectionEnum).map(
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
                  label="Connection"
                  className="col-span-full md:col-span-1"
                  error={errors?.connection?.message}
                  dropdownClassName="!z-[1]"
                />
              );
            }}
          />
        </div>
        <div>
          <Controller
            name="typeUuid"
            control={control}
            render={({ field: { name, onChange, value } }) => (
              <Select
                options={types.map((type) => ({
                  value: type?.uuid,
                  label: type?.name,
                }))}
                value={value}
                onChange={onChange}
                name={name}
                label="Type"
                className="col-span-full md:col-span-1"
                error={errors?.typeUuid?.message}
                getOptionValue={(option) => option.value}
                displayValue={(selectedValue) =>
                  types.find((type) => type?.uuid === selectedValue)?.name ?? ''
                }
                dropdownClassName="!z-[1]"
              />
            )}
          />
        </div>

        <div>
          <Input
            label="Max Markup"
            placeholder="Max Markup"
            {...register('maxMarkup', {
              setValueAs: (value) => parseFloat(value), // Convert to number
            })}
            error={errors.maxMarkup?.message}
            className="col-span-full mb-5 text-xl md:col-span-1"
          />

          <Input
            label="Min Markup"
            placeholder="Min Markup"
            {...register('minMarkup', {
              setValueAs: (value) => parseFloat(value), // Convert to number
            })}
            error={errors.minMarkup?.message}
            className="col-span-full mb-5 text-xl md:col-span-1"
          />

          <Input
            label="Markup"
            placeholder="Markup"
            {...register('markup', {
              setValueAs: (value) => parseFloat(value), // Convert to number
            })}
            error={errors.markup?.message}
            className="col-span-full mb-5 text-xl md:col-span-1"
          />
          <Controller
            name="isActive"
            control={control}
            render={({ field: { value = active, onChange } }) => (
              <div className="flex items-center">
                <Switch checked={value} onChange={onChange} className="mr-2" />
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
    </form>
  );
}
