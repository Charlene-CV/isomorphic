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
import { UpdateCustomerSchema } from '@/validators/create-customer.schema';
import {
  BillingOptionsEnum,
  CustomerServiceTypeEnum,
  CustomerTypesEnum,
  LiveLocationEnum,
} from '@/config/constants';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Tag {
  uuid: string;
  name: string;
}

interface Accessorial {
  uuid: string;
  name: string;
}

interface EditCustomerProps {
  customerUuid: string;
}

export default function EditCustomer({ customerUuid }: EditCustomerProps) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [accessorials, setAccessorials] = useState<Accessorial[]>([]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateCustomerSchema>({
    mode: 'onBlur',
  });

  const fetchCustomer = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/customers/find-one/${customerUuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormValues(response.data?.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };

  const setFormValues = (customer: any) => {
    setValue('name', customer?.name || '');
    setValue('shortCode', customer?.shortCode || '');
    setValue('customerType', customer?.customerType || '');
    setValue('billingOption', customer?.billingOption || '');
    setValue('isActive', customer?.isActive || false);
    setValue('requireQuote', customer?.requireQuote || false);

    setValue(
      'accessorialUuids',
      customer?.accessorials?.map((acc: Accessorial) => acc.uuid) || []
    );
    setValue('tagsUuids', customer?.tags?.map((tag: Tag) => tag.uuid) || []);
    setValue('currency', customer?.currency || 'CAD');
    setValue('addresses', customer?.addresses || null);
    setValue('balance', customer?.balance || null);
    setValue('creditLimit', customer?.creditLimit || null);
    setValue('externalId', customer?.externalId || '');
    setValue('quickbookId', customer?.quickbookId || '');
    setValue('requireDimensions', customer?.requireDimensions || false);
    setValue('hasPortalAccess', customer?.hasPortalAccess || false);
    setValue('liveLocation', customer?.liveLocation || '');
    setValue('businessHours', customer?.businessHours || null);
    setValue('notes', customer?.notes || '');
    setValue('serviceType', customer?.serviceType || '');
    setValue('contactName', customer?.contactName || '');
    setValue('contactEmail', customer?.contactEmail || '');
    setValue('contactPhone', customer?.contactPhone || '');
  };

  const fetchAccessorialsAndTags = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      const [accessResponse, tagsResponse] = await Promise.all([
        axios.get<{ data: Accessorial[] }>(
          `${baseUrl}/api/v1/accessorials/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get<{ data: Tag[] }>(`${baseUrl}/api/v1/tags/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setAccessorials(accessResponse?.data?.data);
      setTags(tagsResponse?.data?.data);
    } catch (error) {
      console.error('Error fetching accessorials and tags:', error);
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchAccessorialsAndTags();
  }, []);

  const onSubmit: SubmitHandler<UpdateCustomerSchema> = async (data) => {
    setLoading(true);
    const userToken: any = JSON.parse(Cookies.get('user'));
    const token = userToken.token;
    try {
      const updatedData = {
        ...data,
        accessorialUuids: data.accessorialUuids,
        tagUuids: data.tagsUuids,
      };

      const response = await axios.put(
        `${baseUrl}/api/v1/customers/update/${customerUuid}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Customer updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
      >
        <>
          <div className="col-span-full flex items-center justify-between">
            <Title as="h4" className="font-semibold">
              Edit Customer
            </Title>
            <ActionIcon size="sm" variant="text" onClick={closeModal}>
              <PiXBold className="h-auto w-5" />
            </ActionIcon>
          </div>
          <div>
            <Input
              label="Name"
              placeholder="Enter customer's name"
              {...register('name')}
              className="col-span-full mb-5 text-xl md:col-span-1"
              error={errors.name?.message}
            />
          </div>
          <div>
            <Input
              label="Short Code"
              placeholder="Enter user's Short Code"
              className="col-span-full"
              {...register('shortCode')}
              error={errors.shortCode?.message}
            />
          </div>
          <div>
            <Input
              label="External ID"
              placeholder="Enter customer's External ID"
              {...register('externalId')}
              className="col-span-full mb-5 text-xl md:col-span-1"
              error={errors.externalId?.message}
            />
          </div>
          <div>
            <Input
              label="Quickbook ID"
              placeholder="Enter user's Quickbook ID"
              className="col-span-full"
              {...register('quickbookId')}
              error={errors.quickbookId?.message}
            />
          </div>
          <div>
            <Input
              label="Balance"
              placeholder="Enter user's Balance"
              className="col-span-full"
              {...register('balance')}
              error={errors.balance?.message}
            />
          </div>
          <div>
            <Input
              label="Credit Limit"
              placeholder="Enter user's Credit Limit"
              className="col-span-full"
              {...register('creditLimit')}
              error={errors.creditLimit?.message}
            />
          </div>
          <div>
            <Input
              label="Contact Name"
              placeholder="Enter user's contact Name"
              className="col-span-full"
              {...register('contactName')}
              error={errors.contactName?.message}
            />
          </div>

          <div>
            <Input
              label="Contact Email"
              placeholder="Enter customer's Contact email"
              {...register('contactEmail')}
              className="col-span-full mb-5 text-xl md:col-span-1"
              error={errors.contactEmail?.message}
            />
          </div>
          <div>
            <Input
              label="Contact Phone"
              placeholder="Enter user's Contact Phone"
              className="col-span-full"
              {...register('contactPhone')}
              error={errors.contactPhone?.message}
            />
          </div>
          <div>
            <Controller
              name="customerType"
              control={control}
              render={({ field: { name, onChange, value } }) => {
                // Create options from the enum
                const options = Object.entries(CustomerTypesEnum).map(
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
                    label="Customer Type"
                    className="col-span-full md:col-span-1"
                    error={errors?.customerType?.message}
                    dropdownClassName="!z-[1]"
                  />
                );
              }}
            />
          </div>
          <div>
            <Controller
              name="billingOption"
              control={control}
              render={({ field: { name, onChange, value } }) => {
                // Create options from the enum
                const options = Object.entries(BillingOptionsEnum).map(
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
                    label="Billing Option"
                    className="col-span-full md:col-span-1"
                    error={errors?.billingOption?.message}
                    dropdownClassName="!z-[1]"
                  />
                );
              }}
            />
          </div>
          <div>
            <Controller
              name="liveLocation"
              control={control}
              render={({ field: { name, onChange, value } }) => {
                // Create options from the enum
                const options = Object.entries(LiveLocationEnum).map(
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
                    label="Live Location"
                    className="col-span-full md:col-span-1"
                    error={errors?.liveLocation?.message}
                    dropdownClassName="!z-[1]"
                  />
                );
              }}
            />
          </div>
          <div>
            <Controller
              name="serviceType"
              control={control}
              render={({ field: { name, onChange, value } }) => {
                // Create options from the enum
                const options = Object.entries(CustomerServiceTypeEnum).map(
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
                    label="Service Type"
                    className="col-span-full md:col-span-1"
                    error={errors?.serviceType?.message}
                    dropdownClassName="!z-[1]"
                  />
                );
              }}
            />
          </div>
          <div>
            <Controller
              name="tagsUuids"
              control={control}
              render={({ field }) => (
                <div>
                  <Select
                    {...field}
                    label="Select Tags"
                    placeholder="Select tags"
                    options={tags.map((tag) => ({
                      value: tag.uuid,
                      label: tag.name,
                    }))}
                    value={tags.filter((tag) =>
                      field.value?.includes(tag.uuid)
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
                      setValue('tagsUuids', selectedValues);
                      field.onChange(selectedValues);
                    }}
                    displayValue={() =>
                      field.value
                        ? field.value
                            .map(
                              (uuid: string) =>
                                tags.find((tag) => tag.uuid === uuid)?.name
                            )
                            .filter(Boolean)
                            .join(', ') // Display tag names for selected UUIDs
                        : ''
                    }
                    error={errors.tagsUuids?.message}
                    // dropdownClassName="!z-[1]"
                  />

                  <div className="selected-tags mt-2 flex flex-wrap gap-2">
                    {field.value?.map((uuid: string) => {
                      const tag = tags.find((tag) => tag.uuid === uuid);
                      return (
                        <div
                          key={uuid}
                          className="bg-gray-200 text-gray-800 py-1 px-2 rounded flex items-center"
                        >
                          {tag?.name}
                          <button
                            className="ml-2 text-red-500"
                            onClick={() => {
                              const updatedValues =
                                field.value &&
                                field.value.filter((id: string) => id !== uuid);
                              setValue('tagsUuids', updatedValues || []);
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
                      setValue('accessorialUuids', selectedValues);
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
                    // dropdownClassName="!z-[1]"
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
                              setValue('accessorialUuids', updatedValues || []);
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
          </div>
          <div>
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
              name="isActive"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="flex items-center">
                  <Switch
                    checked={value} // Ensure it reflects the current state
                    onChange={onChange} // Bind the onChange handler
                    className="mr-2"
                  />
                  <label>Active</label>
                </div>
              )}
            />
            <Controller
              name="requireQuote"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="flex items-center">
                  <Switch
                    checked={value} // Ensure it reflects the current state
                    onChange={onChange} // Bind the onChange handler
                    className="mr-2"
                  />
                  <label>Require Quote</label>
                </div>
              )}
            />
            <Controller
              name="requireDimensions"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="flex items-center">
                  <Switch
                    checked={value} // Ensure it reflects the current state
                    onChange={onChange} // Bind the onChange handler
                    className="mr-2"
                  />
                  <label>Require Dimensions</label>
                </div>
              )}
            />
            <Controller
              name="hasPortalAccess"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="flex items-center">
                  <Switch
                    checked={value} // Ensure it reflects the current state
                    onChange={onChange} // Bind the onChange handler
                    className="mr-2"
                  />
                  <label>Portal Access</label>
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
      <ToastContainer />
    </>
  );
}
