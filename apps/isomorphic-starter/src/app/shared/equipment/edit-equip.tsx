'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Input, Button, ActionIcon, Title, Text, Modal } from 'rizzui';
import { EquipFormInput, equipFormSchema } from '@/validators/equipment-schema';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from '@/app/shared/modal-views/use-modal';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import FormGroup from '../form-group';
import { Checkbox } from "@nextui-org/checkbox";

export default function EditEquip({ fetchEquipments, equipData }: any) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EquipFormInput>({
    defaultValues: {
      name: equipData?.name || '',
      status: equipData?.status || '',
      description: equipData?.description ?? null,
      externalId: equipData?.externalId ?? null,
      isBillable: equipData?.isBillable || false,
      isIftaTracking: equipData?.isIftaTracking || false,
      vin: equipData?.vin ?? null,
      payAmount: equipData?.payAmount ?? null,
      specifications: {
        length: equipData?.specifications?.length || 0,
        width: equipData?.specifications?.width || 0,
        height: equipData?.specifications?.height || 0,
        weight: equipData?.specifications?.weight || 0,
        capacity: equipData?.specifications?.capacity || 0,
        units: equipData?.specifications?.units || '',
      },
      licenses: equipData?.licenses || [],
      managerUuid: equipData?.managerUuid ?? null,
      driverUuid: equipData?.driverUuid ?? null,
      typeUuid: equipData?.typeUuid || '',
      subTypeUuid: equipData?.subTypeUuid ?? null,
      paymentTypeUuid: equipData?.paymentTypeUuid ?? null,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (equipData) {
      reset({
        name: equipData?.name,
        status: equipData?.status,
        description: equipData?.description ?? null,
        externalId: equipData?.externalId ?? null,
        isBillable: equipData?.isBillable ?? false,
        isIftaTracking: equipData?.isIftaTracking ?? false,
        vin: equipData?.vin ?? null,
        payAmount: equipData?.payAmount ?? null,
        specifications: {
          length: equipData?.specifications?.length || 0,
          width: equipData?.specifications?.width || 0,
          height: equipData?.specifications?.height || 0,
          weight: equipData?.specifications?.weight || 0,
          capacity: equipData?.specifications?.capacity || 0,
          units: equipData?.specifications?.units || '',
        },
        licenses: equipData?.licenses ?? [],
        managerUuid: equipData?.managerUuid ?? null,
        driverUuid: equipData?.driverUuid ?? null,
        typeUuid: equipData?.typeUuid ?? '',
        subTypeUuid: equipData?.subTypeUuid ?? null,
        paymentTypeUuid: equipData?.paymentTypeUuid ?? null
      });
    }
  }, [equipData, reset]);

  const onSubmit: SubmitHandler<EquipFormInput> = async (data) => {
    const formattedData = {
      name: data?.name,
      status: data?.status,
      description: data?.description ?? null,
      externalId: data?.externalId ?? null,
      isBillable: data?.isBillable ?? false,
      isIftaTracking: data?.isIftaTracking ?? false,
      vin: data?.vin ?? null,
      payAmount: data?.payAmount ?? null,
      specifications: {
        length: data?.specifications?.length || 0,
        width: data?.specifications?.width || 0,
        height: data?.specifications?.height || 0,
        weight: data?.specifications?.weight || 0,
        capacity: data?.specifications?.capacity || 0,
        units: data?.specifications?.units || '',
      },
      licenses: data?.licenses ?? [],
      managerUuid: data?.managerUuid ?? null,
      driverUuid: data?.driverUuid ?? null,
      typeUuid: data?.typeUuid ?? '',
      subTypeUuid: data?.subTypeUuid ?? null,
      paymentTypeUuid: data?.paymentTypeUuid ?? null
    };
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      const response = await axios.put(`${baseUrl}/api/v1/taxes/update/${equipData.uuid}`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        fetchEquipments();
        closeModal();
        toast.success(<Text>Equipment edited successfully!</Text>);
      } else {
        toast.error(<Text>Error editing equipment...</Text>);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 p-6">
      <>
        <div className="flex items-center justify-between">
          <Title as="h4" className="font-semibold">
            Edit Equipment
          </Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal}>
            <PiXBold className="h-auto w-5" />
          </ActionIcon>
        </div>

        <FormGroup title="Equipment Details">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Name"
              placeholder="Enter equipment name"
              {...register('name')}
              className="w-full"
              error={errors.name?.message}
            />

            <Input
              label="Status"
              placeholder="Enter status"
              {...register('status')}
              className="w-full"
              error={errors.status?.message}
            />

            <Input
              label="Description"
              placeholder="Enter description"
              {...register('description')}
              className="w-full"
              error={errors.description?.message}
            />

            <Input
              label="External ID"
              placeholder="Enter external"
              {...register('externalId')}
              className="w-full"
              error={errors.externalId?.message}
            />

            <Input
              label="VIN"
              placeholder="Enter VIN"
              {...register('vin')}
              className="w-full"
              error={errors.vin?.message}
            />

            <Input
              label="Pay Amount"
              placeholder="Enter pay amount"
              {...register('payAmount', {
                setValueAs: (value) => parseFloat(value) || 0,
              })}
              className="w-full"
              error={errors.payAmount?.message}
            />

            <Input
              label="Manager"
              placeholder="Enter manager"
              {...register('managerUuid')}
              className="w-full"
              error={errors.managerUuid?.message}
            />

            <Input
              label="Driver"
              placeholder="Enter driver"
              {...register('driverUuid')}
              className="w-full"
              error={errors.driverUuid?.message}
            />

            <Input
              label="Type"
              placeholder="Enter type"
              {...register('typeUuid')}
              className="w-full"
              error={errors.typeUuid?.message}
            />

            <Input
              label="Sub-Type"
              placeholder="Enter sub-type"
              {...register('subTypeUuid')}
              className="w-full"
              error={errors.subTypeUuid?.message}
            />

            <Input
              label="Payment Type"
              placeholder="Enter payment type"
              {...register('paymentTypeUuid')}
              className="w-full"
              error={errors.paymentTypeUuid?.message}
            />

            <Controller
              name="isBillable"
              control={control}
              render={({ field }) => (
                <Checkbox
                  isSelected={field.value}
                  onChange={field.onChange}
                  defaultSelected={field.value}
                >
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    style={{
                      outline: '0.5px solid #d1d5db',
                      borderRadius: '0.25rem',
                      padding: '4px',
                      marginRight: '10px',
                      marginBottom: '4px'
                    }}
                  />
                  Billable
                </Checkbox>
              )}
            />

            <Controller
              name="isIftaTracking"
              control={control}
              render={({ field }) => (
                <Checkbox
                  isSelected={field.value}
                  onChange={field.onChange}
                  defaultSelected={field.value}
                >
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    style={{
                      outline: '0.5px solid #d1d5db',
                      borderRadius: '0.25rem',
                      padding: '4px',
                      marginRight: '10px',
                      marginBottom: '4px'
                    }}
                  />
                  IFTA Tracking
                </Checkbox>
              )}
            />
          </div>
        </FormGroup>

        <div className="flex justify-end gap-4 mt-5">
          <Button variant="outline" onClick={closeModal} className="w-full md:w-auto">
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
            Edit Equipment
          </Button>
        </div>
      </>
    </form>
  );
}
