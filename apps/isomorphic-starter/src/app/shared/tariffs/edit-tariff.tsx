'use client';

import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input, Button, Title, Select, Switch } from 'rizzui';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import { UpdateTariffInput } from '@/validators/tariff-schema';
import { Accessorial } from '../accessorials';
import { Tariffs } from '.';
import moment from 'moment';
import { TariffTypes } from '@/config/constants';
import { Customer } from '../customers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CwtRangeComponent from './cwtRange';
import CwtLanesComponent from './cwtLane';

interface EditTariffProps {
  tariffUuid: string;
}

export default function EditTariff({ tariffUuid }: EditTariffProps) {
  const [isLoading, setLoading] = useState(false);
  const [accessorials, setAccessorials] = useState<Accessorial[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tariffName, setTariffName] = useState<string | null>(null);
  const [fuel, setFuel] = useState([]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateTariffInput>({
    mode: 'onBlur',
  });

  const fetchTariff = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/tariffs/find-one/${tariffUuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormValues(response.data?.data);
    } catch (error) {
      console.error('Error fetching tariff:', error);
    }
  };

  const setFormValues = (tariff: any) => {
    setTariffName(tariff?.name || '');
    setValue('name', tariff?.name || '');
    setValue('type', tariff?.type || '');
    setValue('notes', tariff?.notes || '');
    setValue('fuelTable', tariff?.fuelTable || '');
    setValue('basePerc', tariff?.basePerc || 0);
    setValue('adjustmentPerc', tariff?.adjustmentPerc || 0);
    setValue('ratePerc', tariff?.ratePerc || 0);
    setValue('rangMultiplier', tariff?.rangMultiplier || 0);
    setValue(
      'startDate',
      tariff?.startDate ? new Date(tariff.startDate) : new Date()
    );
    setValue(
      'endDate',
      tariff?.endDate
        ? new Date(tariff.endDate)
        : new Date(moment().add(1, 'year').toISOString())
    );
    setValue('isActive', tariff?.isActive || false);
    setValue('isImporting', tariff?.isImporting || false);
    setValue('customerUuid', tariff?.customer?.uuid || '');
    setValue(
      'accessorialUuids',
      tariff?.accessorials?.map((acc: Accessorial) => acc.uuid) || []
    );
  };

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

  const fetchCustomers = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      const response = await axios.get<{ data: Customer[] }>(
        `${baseUrl}/api/v1/customers/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(response.data?.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchFuel = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;

    try {
      const response = await axios.get(`${baseUrl}/api/v1/fuel/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFuel(response?.data?.data);
    } catch (error) {
      console.error('Error fetching fuel:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchAccessorials();
    fetchTariff();
    fetchFuel();
  }, []);

  const onSubmit: SubmitHandler<UpdateTariffInput> = async (data) => {
    setLoading(true);
    const userToken: any = JSON.parse(Cookies.get('user'));
    const token = userToken.token;
    try {
      const updatedData = {
        ...data,
        startDate: moment(data.startDate).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(data.endDate).format('YYYY-MM-DD HH:mm:ss'),
        accessorialUuids: data.accessorialUuids,
        customerUuid: data?.customerUuid,
      };

      const response = await axios.put(
        `${baseUrl}/api/v1/tariffs/update/${tariffUuid}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Tariff updated successfully!', {
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
              Edit {tariffName ? `/ (${tariffName})` : 'Tariff'}
            </Title>
          </div>

          {/* BASIC INFO */}
          <div className="col-span-full border border-gray-300 rounded-lg p-4">
            <Title as="h5" className="font-semibold mb-4">
              Basic Info
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Name"
                  placeholder="Enter tariff's name"
                  {...register('name')}
                  className="col-span-full mb-5 text-xl md:col-span-1"
                  error={errors.name?.message}
                />
              </div>
              <div>
                <Controller
                  name="customerUuid"
                  control={control}
                  render={({ field: { name, onChange, value } }) => {
                    return (
                      <Select
                        label="Customer"
                        placeholder="Select a customer"
                        options={customers.map((customer) => ({
                          value: customer.uuid,
                          label: customer.name,
                        }))}
                        value={value}
                        onChange={onChange}
                        name={name}
                        className="col-span-full md:col-span-1"
                        error={errors?.customerUuid?.message}
                        getOptionValue={(option) => option.value}
                        displayValue={(selectedValue) =>
                          customers.find(
                            (customer) => customer.uuid === selectedValue
                          )?.name ?? ''
                        }
                        dropdownClassName="!z-[1]"
                      />
                    );
                  }}
                />
              </div>
              <div>
                <Controller
                  name="type"
                  control={control}
                  render={({ field: { name, onChange, value } }) => {
                    // Create options from the enum
                    const options = Object.entries(TariffTypes).map(
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
                          (selectedOption: any) =>
                            onChange(selectedOption.value) // Pass the enum label to onChange
                        }
                        name={name}
                        label="Tariff Type"
                        className="col-span-full md:col-span-1"
                        error={errors?.type?.message}
                        dropdownClassName="!z-[1]"
                      />
                    );
                  }}
                />
              </div>
              <div>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Start Date and Time"
                      placeholder="Enter start date and time"
                      {...field}
                      type="datetime-local"
                      value={
                        field.value
                          ? moment(field.value).isValid()
                            ? moment(field.value).format('YYYY-MM-DDTHH:mm')
                            : moment(new Date()).format('YYYY-MM-DDTHH:mm')
                          : moment(new Date()).format('YYYY-MM-DDTHH:mm')
                      }
                      className="col-span-full"
                      error={errors?.startDate?.message}
                      onChange={(e) => {
                        const dateTimeValue = e.target.value;
                        field.onChange(dateTimeValue); // no need for extra moment parsing here
                      }}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="End Date and Time"
                      placeholder="Enter end date and time"
                      {...field}
                      type="datetime-local"
                      value={
                        field.value
                          ? moment(field.value).isValid()
                            ? moment(field.value).format('YYYY-MM-DDTHH:mm')
                            : moment(new Date())
                                .add(1, 'year')
                                .format('YYYY-MM-DDTHH:mm')
                          : moment(new Date())
                              .add(1, 'year')
                              .format('YYYY-MM-DDTHH:mm')
                      }
                      className="col-span-full"
                      error={errors?.endDate?.message}
                      onChange={(e) => {
                        const dateTimeValue = e.target.value;
                        field.onChange(dateTimeValue); // no need for extra moment parsing here
                      }}
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
                  name="isImporting"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <div className="flex items-center">
                      <Switch
                        checked={value} // Ensure it reflects the current state
                        onChange={onChange} // Bind the onChange handler
                        className="mr-2"
                      />
                      <label>Importing</label>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* FUEL TABLE */}
          <div className="col-span-full border border-gray-300 rounded-lg p-4">
            <Title as="h5" className="font-semibold mb-4">
              Fuel Table
            </Title>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fuel Table Field */}
              <div>
                <Controller
                  name="fuelTable"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Fuel Table"
                      placeholder="Enter fuel table"
                      error={errors.fuelTable?.message}
                    />
                  )}
                />
              </div>

              {/* Base Percentage Field */}
              <div>
                <Controller
                  name="basePerc"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Base Percentage"
                      type="number"
                      placeholder="Enter base percentage"
                      value={field.value ?? ''}
                      error={errors.basePerc?.message}
                    />
                  )}
                />
              </div>

              {/* Adjustment Percentage Field */}
              <div>
                <Controller
                  name="adjustmentPerc"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Adjustment Percentage"
                      type="number"
                      placeholder="Enter adjustment percentage"
                      value={field.value ?? ''}
                      error={errors.adjustmentPerc?.message}
                    />
                  )}
                />
              </div>

              {/* Rate Percentage Field */}
              <div>
                <Controller
                  name="ratePerc"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Rate Percentage"
                      type="number"
                      placeholder="Enter rate percentage"
                      value={field.value ?? ''}
                      error={errors.ratePerc?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* CWT RANGES */}
          {/* <div className="col-span-full border border-gray-300 rounded-lg p-4"> */}
          {/* <Title as="h5" className="font-semibold mb-4">
              CWT Ranges
            </Title> */}

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
          {/* <div>
                <Input
                  label="PCF Multiplier (Standard is 10)"
                  placeholder="Rang Multiplier"
                  {...register('rangMultiplier')}
                  className="col-span-full mb-5 text-xl md:col-span-1"
                  error={errors.rangMultiplier?.message}
                />
              </div> */}
          <CwtRangeComponent />
          {/* </div> */}
          {/* </div> */}

          {/* CWT LANES */}
          {/* <div className="col-span-full border border-gray-300 rounded-lg p-4">
            <Title as="h5" className="font-semibold mb-4">
              CWT Lanes
            </Title>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="PCF Multiplier (Standard is 10)"
                  placeholder="Rang Multiplier"
                  {...register('rangMultiplier')}
                  className="col-span-full mb-5 text-xl md:col-span-1"
                  error={errors.rangMultiplier?.message}
                />
              </div>
            </div>
          </div> */}
          <CwtLanesComponent />

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

          <div className="col-span-full flex items-center justify-end gap-4">
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
