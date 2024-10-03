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
  // const [customer, setCustomer] = useState<any>(null);

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

      // setCustomer(response.data?.data);
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
        tagsUuids: data.tagsUuids,
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
          position: 'top-right', // Positioning
          autoClose: 3000, // Auto close after 3 seconds
          hideProgressBar: true, // Hide the progress bar
          closeOnClick: true, // Close on click
          pauseOnHover: false, // Don't pause on hover
          draggable: false, // Make it non-draggable
          progress: undefined, // No progress bar
        }); // Show success message
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
            <Input
              label="Short Code"
              placeholder="Enter user's Short Code"
              className="col-span-full"
              {...register('shortCode')}
              error={errors.shortCode?.message}
            />

            <Input
              label="External ID"
              placeholder="Enter customer's External ID"
              {...register('externalId')}
              className="col-span-full mb-5 text-xl md:col-span-1"
              error={errors.externalId?.message}
            />
            <Input
              label="Quickbook ID"
              placeholder="Enter user's Quickbook ID"
              className="col-span-full"
              {...register('quickbookId')}
              error={errors.quickbookId?.message}
            />
            <Input
              label="Balance"
              placeholder="Enter user's Balance"
              className="col-span-full"
              {...register('balance')}
              error={errors.balance?.message}
            />
            <Input
              label="Credit Limit"
              placeholder="Enter user's Credit Limit"
              className="col-span-full"
              {...register('creditLimit')}
              error={errors.creditLimit?.message}
            />
            <Input
              label="contact Name"
              placeholder="Enter user's contact Name"
              className="col-span-full"
              {...register('contactName')}
              error={errors.contactName?.message}
            />

            <Input
              label="Contact Email"
              placeholder="Enter customer's Contact email"
              {...register('contactEmail')}
              className="col-span-full mb-5 text-xl md:col-span-1"
              error={errors.contactEmail?.message}
            />
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
                    label="Type"
                    className="col-span-full md:col-span-1"
                    error={errors?.customerType?.message}
                    dropdownClassName="!z-[1]"
                  />
                );
              }}
            />
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
                    label="Type"
                    className="col-span-full md:col-span-1"
                    error={errors?.liveLocation?.message}
                    dropdownClassName="!z-[1]"
                  />
                );
              }}
            />
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
                    label="Type"
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
                  {/* The multi-select for selecting tags */}
                  <Select
                    {...field} // Pass field properties to the Select component
                    label="Select Tags"
                    placeholder="Select tags"
                    options={tags.map((tag) => ({
                      value: tag.uuid,
                      label: tag.name,
                    }))} // Map the tags array to the required format for the select component
                    value={tags.filter((tag) =>
                      field.value?.includes(tag.uuid)
                    )} // Selects the tags matching the current field values
                    onChange={(selectedOption: any) => {
                      // Handle multiple selected tags
                      const selectedValues = selectedOption
                        ? selectedOption.map((option: any) => option.value)
                        : [];

                      // Update the form value with selected UUIDs
                      field.onChange(selectedValues);
                    }}
                    error={errors.tagsUuids?.message} // Show error if any
                  />

                  {/* Display the selected tags with an option to remove them */}
                  <div className="selected-tags mt-2 flex flex-wrap gap-2">
                    {field.value?.map((uuid: string) => {
                      const tag = tags.find((tag) => tag.uuid === uuid); // Find the tag by UUID
                      return (
                        <div
                          key={uuid}
                          className="bg-gray-200 text-gray-800 py-1 px-2 rounded flex items-center"
                        >
                          {tag?.name} {/* Display tag name */}
                          <button
                            className="ml-2 text-red-500"
                            onClick={() => {
                              // Remove the selected tag when '×' is clicked
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
                  <label>Quote</label>
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
                  <label>Dimenstions</label>
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
