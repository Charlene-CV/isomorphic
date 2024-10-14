"use client";

import { useEffect, useState } from "react";
import { PiXBold } from "react-icons/pi";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { Form } from "@ui/form";
import { Input, Button, ActionIcon, Title, Text, Select } from "rizzui";
import { CustomerFormInput } from "@/validators/create-order.schema";
import { useModal } from "@/app/shared/modal-views/use-modal";
import axios from "axios";
import { baseUrl } from "@/config/url";
// @ts-ignore
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import FormGroup from "../form-group";
import { getDropData } from "../getDropdown";
import AsyncSelect from 'react-select/async';
import { filter } from "lodash";
import { GroupBase, OptionsOrGroups } from "node_modules/react-select/dist/declarations/src/types";

export default function CreateOrder({ fetchOrders }: any) {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<CustomerFormInput[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerFormInput[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CustomerFormInput>({
    defaultValues: {
      billingParty: {
        name: "",
        shortCode: "",
        customerType: "shipper",
        billingOption: "shipper",
        requireQuote: false,
        currency: "CAD",
        isActive: true,
        addresses: {
          city: "",
          state: "",
          postal: "",
          address: "",
          country: "",
          latitude: 0,
          longitude: 0,
        },
      },
    },
    mode: "onBlur",
  });

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "addresses",
  // });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customers = await getDropData('api/v1/customers/all');
        ///////////////////////check
        const billingParties = customers.filter((customer: { customerType: string }) => customer.customerType.includes("shipper"));
        console.log({ billingParties })
        setCustomers(customers || []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
    fetchData();
  }, []);

  let defaultCustomers: OptionsOrGroups<{ label: string; value: string }, GroupBase<{ label: string; value: string }>> = customers.map(customer => ({
    label: customer.billingParty.name,
    value: customer.billingParty.name,
  }));

  const loadCustomers = async (data: string) => {
    try {
      const customers = await getDropData('api/v1/customers/all');
      const billingParties = customers.filter((customer: { customerType: string }) => customer.customerType.includes("shipper"));
      const filteredBillingParties = billingParties.filter((customer: { name: string }) => customer.name.includes(data));
      setFilteredCustomers(filteredBillingParties);
      return filteredBillingParties;
    } catch (error) {
      console.error("Error during customer filtering:", error);
    }
  };

  const onSubmit: SubmitHandler<CustomerFormInput> = async (data) => {
    const formattedData = {
      billingParty: {
        name: data.billingParty.name,
        shortCode: data.billingParty.shortCode,
        customerType: data.billingParty.customerType,
        billingOption: data.billingParty.billingOption,
        requireQuote: data.billingParty.requireQuote,
        currency: data.billingParty.currency,
        isActive: data.billingParty.isActive,
        addresses: {
          city: data.billingParty.addresses.city,
          state: data.billingParty.addresses.state,
          postal: data.billingParty.addresses.postal,
          address: data.billingParty.addresses.address,
          country: data.billingParty.addresses.country,
          latitude: data.billingParty.addresses.latitude,
          longitude: data.billingParty.addresses.longitude,
        },
      },
    };
    try {
      const user: any = JSON.parse(Cookies.get("user"));
      const token = user.token;
      const response = await axios.post(
        `${baseUrl}/api/v1/orders/create`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReset({
        name: "",
      });
      if (response.status === 200) {
        fetchOrders();
        closeModal();
        toast.success(<Text>Order added successfully!</Text>);
      } else {
        toast.error(<Text>Error adding order...</Text>);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };
 
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 p-6">
      <div className="flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Add a New Order
        </Title>
        <ActionIcon size="sm" variant="text" onClick={closeModal}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>

      {/* <Controller
        name="uuid"
        control={control}
        render={({ field }) => (
          <AsyncSelect
            cacheOptions
            defaultOptions={defaultCustomers}
            loadOptions={(inputValue, callback) => {
              loadCustomers(inputValue).then(data => {
                callback(data.map((customer: { uuid: any; billingParty: { name: any; }; }) => ({ value: customer.uuid, label: customer.billingParty.name })))
              });
            }}
            placeholder="Select customer"
            onInputChange={field.onChange}
            onChange={(value) => field.onChange(value)}
            value={field.value}
          />
        )}
      /> */}

      <div className="flex justify-end gap-4 mt-5">
        <Button
          variant="outline"
          onClick={closeModal}
          className="w-full md:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full md:w-auto"
        >
          Create Order
        </Button>
      </div>
    </form>
  );
}