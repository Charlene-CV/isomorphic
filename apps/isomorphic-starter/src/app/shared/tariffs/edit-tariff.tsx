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
import CwtRangeComponent, { CwtRange } from './cwtRange';
import CwtLanesComponent, { CwtLanes } from './cwtLane';
// import CommodityForm, { Commodities, CommodityType } from './commodities';

interface EditTariffProps {
  tariffUuid: string;
}

export default function EditTariff({ tariffUuid }: EditTariffProps) {
  const [isLoading, setLoading] = useState(false);
  const [accessorials, setAccessorials] = useState<Accessorial[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tariffName, setTariffName] = useState<string | null>(null);
  const [fuel, setFuel] = useState([]);
  const [tariff, setTariff] = useState<Tariffs | null>(null);
  const [originalRanges, setOriginalRanges] = useState<CwtRange[]>([]);
  const [ranges, setRanges] = useState<CwtRange[]>([]);
  const [pcfMultiplier, setPcfMultiplier] = useState<number>(10);

  const [originalLanes, setOriginalLanes] = useState<CwtLanes[]>([]);
  const [lanes, setLanes] = useState<CwtLanes[]>([]);

  // const [commodityTypes, setCommodityTypes] = useState<CommodityType[]>([]);
  // const [commodities, setCommodities] = useState<Commodities[]>([]);
  // const [originalCommodities, setOriginalCommodities] = useState<Commodities[]>([]);

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

      setTariff(response?.data?.data);
      setFormValues(response.data?.data);
      setPcfMultiplier(response?.data?.data?.rangMultiplier);
    } catch (error) {
      console.error('Error fetching tariff:', error);
    }
  };

  // const fetchCommodityTypes = async () => {
  //   const user: any = JSON.parse(Cookies.get('user'));
  //   const token = user.token;
  //   try {
  //     const response = await axios.get(
  //       `${baseUrl}/api/v1/commodity-types/all`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setCommodityTypes(response.data.data);
  //   } catch (err) {
  //     console.error('Error fetching commodity types', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const setFormValues = (tariff: any) => {
    setTariffName(tariff?.name || '');
    setValue('name', tariff?.name || '');
    setValue('type', tariff?.type || '');
    setValue('notes', tariff?.notes || '');
    setValue('fuelTable', tariff?.fuelTable || '');
    setValue('basePerc', tariff?.basePerc || 0);
    setValue('adjustmentPerc', tariff?.adjustmentPerc || 0);
    setValue('ratePerc', tariff?.ratePerc || 0);
    setValue('rangMultiplier', tariff?.rangMultiplier || pcfMultiplier);
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

  const fetchCwtRanges = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;

    try {
      const response = await axios.get<{ data: CwtRange[] }>(
        `${baseUrl}/api/v1/cwt-ranges/tariff/${tariffUuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRanges(response?.data?.data);
      setOriginalRanges(response?.data?.data);
    } catch (error) {
      console.error('Error fetching cwt ranges:', error);
    }
  };

  const fetchCwtLanes = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;

    try {
      const response = await axios.get<{ data: CwtLanes[] }>(
        `${baseUrl}/api/v1/cwt-lanes/tariff/${tariffUuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLanes(response?.data?.data);
      setOriginalLanes(response?.data?.data);
    } catch (error) {
      console.error('Error fetching cwt lanes:', error);
    }
  };

  // const fetchCommodities = async () => {
  //   const user: any = JSON.parse(Cookies.get('user'));
  //   const token = user.token;
  //   try {
  //     const orderUuid = 'fbdbd91d-6229-4f85-9953-2f3ad30483f1';
  //     const response = await axios.get<{ data: Commodities[] }>(
  //       `${baseUrl}/api/v1/commodities/order/${orderUuid}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log('response', response?.data?.data);
  //     setCommodities(response?.data?.data);
  //     setOriginalCommodities(response?.data?.data);
  //   } catch (error) {
  //     console.error('Error fetching commodities:', error);
  //   }
  // };

  useEffect(() => {
    fetchCustomers();
    fetchAccessorials();
    fetchTariff();
    fetchFuel();
    fetchCwtRanges();
    fetchCwtLanes();
    // Commodities
    // fetchCommodityTypes();
    // fetchCommodities();
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
        rangMultiplier: pcfMultiplier,
      };

      // First, update the main tariff
      const response = await axios.put(
        `${baseUrl}/api/v1/tariffs/update/${tariffUuid}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPcfMultiplier(response?.data?.data?.rangMultiplier);

      // Determine ranges to create, update, and delete
      const rangesToCreate = ranges.filter(
        (range) => !originalRanges.some((orig) => orig.uuid === range.uuid)
      );
      const rangesToUpdate = ranges.filter((range) =>
        originalRanges.some((orig) => orig.uuid === range.uuid)
      );
      const rangesToDelete = originalRanges.filter(
        (orig) => !ranges.some((range) => range.uuid === orig.uuid)
      );
      const createdRangeUuids = [];
      // Handle creating ranges
      for (const range of rangesToCreate) {
        try {
          const createResponse = await axios.post(
            `${baseUrl}/api/v1/cwt-ranges/create`,
            {
              tariffUuid: tariffUuid,
              minRange: range.minRange,
              maxRange: range.maxRange,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          createdRangeUuids.push(createResponse.data.data.uuid);
        } catch (error) {
          console.error(
            `Error creating range with min ${range.minRange}:`,
            error
          );
          toast.error(
            `Error creating range: ${range.minRange} - ${range.maxRange}`,
            {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            }
          );
        }
      }

      // Handle updating ranges
      for (const range of rangesToUpdate) {
        try {
          await axios.put(
            `${baseUrl}/api/v1/cwt-ranges/update/${range?.uuid}`,
            {
              tariffUuid: tariffUuid,
              minRange: range.minRange,
              maxRange: range.maxRange,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          createdRangeUuids.push(range.uuid);
        } catch (error) {
          console.error(`Error updating range with uuid ${range.uuid}:`, error);
          toast.error(
            `Error updating range: ${range.minRange} - ${range.maxRange}`,
            {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            }
          );
        }
      }

      // Handle deleting ranges
      for (const range of rangesToDelete) {
        const uuids = [range?.uuid];
        try {
          await axios.delete(`${baseUrl}/api/v1/cwt-ranges/delete`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { uuids },
          });
        } catch (error) {
          console.error(`Error deleting range with uuid ${range.uuid}:`, error);
          toast.error(
            `Error deleting range: ${range.minRange} - ${range.maxRange}`,
            {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            }
          );
        }
      }

      const lanesToCreate = lanes.filter(
        (lane) => !originalLanes.some((orig) => orig.uuid === lane.uuid)
      );
      const lanesToUpdate = lanes.filter((lane) =>
        originalLanes.some((orig) => orig.uuid === lane.uuid)
      );
      const lanesToDelete = originalLanes.filter(
        (orig) => !lanes.some((lane) => lane.uuid === orig.uuid)
      );

      for (const lane of lanesToCreate) {
        try {
          await axios.post(
            `${baseUrl}/api/v1/cwt-lanes/create`,
            {
              tariffUuid: tariffUuid,
              origin: lane.origin,
              destination: lane.destination,
              minCost: lane.minCost,
              maxCost: lane.maxCost,
              minTransit: lane.minTransit,
              maxTransit: lane.maxTransit,
              priceRange: lane.priceRange,
              cwtRangeUuids: createdRangeUuids,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error(`Error creating lane from ${lane.origin}:`, error);
          toast.error(
            `Error creating lane: ${lane.origin} - ${lane.destination}`,
            {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            }
          );
        }
      }

      for (const lane of lanesToUpdate) {
        try {
          await axios.put(
            `${baseUrl}/api/v1/cwt-lanes/update/${lane.uuid}`,
            {
              tariffUuid: tariffUuid,
              origin: lane.origin,
              destination: lane.destination,
              minCost: lane.minCost,
              maxCost: lane.maxCost,
              minTransit: lane.minTransit,
              maxTransit: lane.maxTransit,
              priceRange: lane.priceRange,
              cwtRangeUuids: createdRangeUuids,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error(`Error updating lane with uuid ${lane.uuid}:`, error);
          toast.error(
            `Error updating lane: ${lane.origin} - ${lane.destination}`,
            {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            }
          );
        }
      }

      for (const lane of lanesToDelete) {
        try {
          await axios.delete(`${baseUrl}/api/v1/cwt-lanes/delete`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { uuids: [lane.uuid] },
          });
        } catch (error) {
          console.error(`Error deleting lane with uuid ${lane.uuid}:`, error);
          toast.error(
            `Error deleting lane: ${lane.origin} - ${lane.destination}`,
            {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            }
          );
        }
      }
      // console.log('commodities', commodities);
      // // Handle commodities
      // const commoditiesToCreate = commodities.filter(
      //   (commodity) =>
      //     !originalCommodities.some((orig) => orig.uuid === commodity.uuid)
      // );
      // const commoditiesToUpdate = commodities.filter((commodity) =>
      //   originalCommodities.some((orig) => orig.uuid === commodity.uuid)
      // );
      // const commoditiesToDelete = originalCommodities.filter(
      //   (orig) => !commodities.some((commodity) => commodity.uuid === orig.uuid)
      // );

      // for (const commodity of commoditiesToCreate) {
      //   try {
      //     await axios.post(
      //       `${baseUrl}/api/v1/commodities/create`,
      //       {
      //         descriptions: commodity.descriptions,
      //         quantity: commodity.quantity,
      //         length: commodity.length,
      //         width: commodity.width,
      //         height: commodity.height,
      //         pieces: commodity.pieces,
      //         lf: commodity.lf,
      //         weight: commodity.weight,
      //         dim: commodity.dim,
      //         class: commodity.class,
      //         typeUuid: commodity.typeUuid || commodity.type.uuid,
      //         orderUuid: commodity.orderUuid,
      //       },
      //       {
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //         },
      //       }
      //     );
      //   } catch (error) {
      //     console.error(`Error creating commodity:`, error);
      //     toast.error(`Error creating commodity: ${commodity.descriptions}`, {
      //       position: 'top-right',
      //       autoClose: 3000,
      //       hideProgressBar: true,
      //       closeOnClick: true,
      //       pauseOnHover: false,
      //       draggable: false,
      //       progress: undefined,
      //     });
      //   }
      // }

      // for (const commodity of commoditiesToUpdate) {
      //   try {
      //     await axios.put(
      //       `${baseUrl}/api/v1/commodities/update/${commodity.uuid}`,
      //       {
      //         descriptions: commodity.descriptions,
      //         quantity: commodity.quantity,
      //         length: commodity.length,
      //         width: commodity.width,
      //         height: commodity.height,
      //         pieces: commodity.pieces,
      //         lf: commodity.lf,
      //         weight: commodity.weight,
      //         dim: commodity.dim,
      //         class: commodity.class,
      //         typeUuid: commodity.type.uuid,
      //         orderUuid:
      //           commodity.orderUuid || 'fbdbd91d-6229-4f85-9953-2f3ad30483f1',
      //       },
      //       {
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //         },
      //       }
      //     );
      //   } catch (error) {
      //     console.error(
      //       `Error updating commodity with uuid ${commodity.uuid}:`,
      //       error
      //     );
      //     toast.error(`Error updating commodity: ${commodity.descriptions}`, {
      //       position: 'top-right',
      //       autoClose: 3000,
      //       hideProgressBar: true,
      //       closeOnClick: true,
      //       pauseOnHover: false,
      //       draggable: false,
      //       progress: undefined,
      //     });
      //   }
      // }

      // for (const commodity of commoditiesToDelete) {
      //   try {
      //     await axios.delete(`${baseUrl}/api/v1/commodities/delete`, {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //       data: { uuids: [commodity.uuid] },
      //     });
      //   } catch (error) {
      //     console.error(
      //       `Error deleting commodity with uuid ${commodity.uuid}:`,
      //       error
      //     );
      //     toast.error(`Error deleting commodity: ${commodity.descriptions}`, {
      //       position: 'top-right',
      //       autoClose: 3000,
      //       hideProgressBar: true,
      //       closeOnClick: true,
      //       pauseOnHover: false,
      //       draggable: false,
      //       progress: undefined,
      //     });
      //   }
      // }

      // If everything succeeds, show the success toast
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

        fetchCwtRanges();
        fetchCwtLanes();
      }
    } catch (error) {
      console.error('Error during form submission:', error);

      // Show error toast for the overall submission process
      toast.error('An error occurred while updating the tariff.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
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
          <CwtRangeComponent
            tariff={tariff as Tariffs}
            cwtRanges={ranges}
            setCwtRanges={setRanges}
            pcfMultiplier={pcfMultiplier}
            setPcfMultiplier={setPcfMultiplier}
          />

          {/* CWT LANES */}
          <CwtLanesComponent
            tariff={tariff as Tariffs}
            cwtRanges={ranges}
            cwtLanes={lanes}
            setCwtLanes={setLanes}
          />
          {/* 
          <CommodityForm
            types={commodityTypes}
            commodities={commodities}
            setCommodities={setCommodities}
          /> */}

          <div className="col-span-full border border-gray-300 rounded-lg p-4">
            <Controller
              name="accessorialUuids"
              control={control}
              render={({ field }) => (
                <div>
                  <Select
                    {...field}
                    label={
                      <h2 className="font-semibold text-lg">
                        Select Accessorials
                      </h2>
                    }
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
