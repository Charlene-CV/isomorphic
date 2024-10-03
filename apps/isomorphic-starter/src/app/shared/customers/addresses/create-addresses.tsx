'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler } from 'react-hook-form';
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

export default function CreateAddresses({ uuid, fetchAddresses }: any) {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [accessorials, setAccessorials] = useState<Accessorial[]>([]);

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
      company: data?.company,
      contactName: data?.contactName,
      phone: data?.phone,
      phoneExt: data?.phoneExt,
      fax: data?.fax,
      email: data?.email,
      businessHours: data?.businessHours,
      addresses: data?.addresses,
      externalId: data?.externalId,
      customBroker: data?.customBroker,
      bolInstruction: data?.bolInstruction,
      shipperNotes: data?.shipperNotes,
      consigneeNotes: data?.consigneeNotes,
      customerUuid: uuid,
      accessorialUuids: data?.accessorialUuids,
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

      setReset({
        company: '',
        contactName: '',
        phone: '',
        phoneExt: '',
        fax: '',
        email: '',
        businessHours: null,
        addresses: null,
        externalId: '',
        customBroker: '',
        bolInstruction: '',
        shipperNotes: '',
        consigneeNotes: '',
        accessorialUuids: [],
      });
      fetchAddresses();
      closeModal();
    } catch (error) {
      console.error('Error during form submission:', error); // Log any errors
    }
  };

  return (
    <Form<CustomerAddressesInput>
      resetValues={reset}
      onSubmit={onSubmit}
      validationSchema={customerAddressesSchema}
      className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, control, watch, formState: { errors } }) => {
        return (
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
                        : field.value
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
                        : field.value
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
                  />
                )}
              />
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
                    {/* The multi-select for selecting accessorials */}
                    <Select
                      {...field} // Pass field properties to the Select component
                      label="Select Accessorials"
                      placeholder="Select accessorials"
                      options={accessorials.map((accessorial) => ({
                        value: accessorial.uuid,
                        label: accessorial.name,
                      }))} // Map the accessorials array to the required format for the select component
                      value={accessorials.filter((accessorial) =>
                        field.value?.includes(accessorial.uuid)
                      )} // Selects the accessorials matching the current field values
                      onChange={(selectedOption: any) => {
                        // Handle multiple selected accessorials
                        const selectedValues = selectedOption
                          ? selectedOption.map((option: any) => option.value)
                          : [];

                        // Update the form value with selected UUIDs
                        field.onChange(selectedValues);
                      }}
                      error={errors.accessorialUuids?.message} // Show error if any
                    />

                    {/* Display the selected accessorials with an option to remove them */}
                    <div className="selected-accessorials mt-2 flex flex-wrap gap-2">
                      {field.value?.map((uuid: string) => {
                        const accessorial = accessorials.find(
                          (accessorial) => accessorial.uuid === uuid
                        ); // Find the accessorial by UUID
                        return (
                          <div
                            key={uuid}
                            className="bg-gray-200 text-gray-800 py-1 px-2 rounded flex items-center"
                          >
                            {accessorial?.name} {/* Display accessorial name */}
                            <button
                              className="ml-2 text-red-500"
                              onClick={() => {
                                // Remove the selected accessorial when '×' is clicked
                                const updatedValues = field.value?.filter(
                                  (id: string) => id !== uuid
                                );
                                field.onChange(updatedValues); // Update the form value with the remaining UUIDs
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
        );
      }}
    </Form>
  );
}
