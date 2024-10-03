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
import { Input, Button, ActionIcon, Title, Text } from "rizzui";
import { CarrierFormInput } from "@/validators/carrier-schema";
import { useModal } from "@/app/shared/modal-views/use-modal";
import axios from "axios";
import { baseUrl } from "@/config/url";
// @ts-ignore
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import FormGroup from "../form-group";

export default function CreateCarrier({ fetchCarriers }: any) {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CarrierFormInput>({
    defaultValues: {
      name: "",
      dotId: null,
      currency: "",
      addresses: [
        {
          address: null,
          city: null,
          state: null,
          postal: null,
          country: null,
          latitude: 0,
          longitude: 0,
        },
      ],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const onSubmit: SubmitHandler<CarrierFormInput> = async (data) => {
    const formattedData = {
      name: data.name,
      dotId: data.dotId ?? null,
      currency: data.currency,
      addresses: data.addresses.map((address: any) => ({
        address: address.address ?? null,
        city: address.city ?? null,
        state: address.state ?? null,
        postal: address.postal ?? null,
        country: address.country ?? null,
        latitude: address.latitude,
        longitude: address.longitude,
      })),
    };
    try {
      const user: any = JSON.parse(Cookies.get("user"));
      const token = user.token;
      const response = await axios.post(
        `${baseUrl}/api/v1/carriers/create`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReset({
        name: "",
        dotId: null,
        currency: "",
        addresses: [
          {
            address: null,
            city: null,
            state: null,
            postal: null,
            country: null,
            latitude: 0,
            longitude: 0,
          },
        ],
      });
      if (response.status === 200) {
        fetchCarriers();
        closeModal();
        toast.success(<Text>Carrier added successfully!</Text>);
      } else {
        toast.error(<Text>Error adding carrier...</Text>);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 p-6">
      <div className="flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Add a New Carrier
        </Title>
        <ActionIcon size="sm" variant="text" onClick={closeModal}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>

      <FormGroup title="Carrier Details" className="space-y-5">
        <Input
          label="Name"
          placeholder="Enter carrier name"
          {...register("name")}
          className="w-full"
          error={errors.name?.message}
        />

        <Input
          label="DOT ID"
          placeholder="Enter DOT ID"
          {...register("dotId")}
          className="w-full"
          error={errors.dotId?.message}
        />

        <Input
          label="Currency"
          placeholder="Enter currency"
          {...register("currency")}
          className="w-full"
          error={errors.currency?.message}
        />

        <FormGroup title="Address" className="space-y-5">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-3">
              <Input
                label="Address"
                placeholder="Enter address"
                {...register(`addresses.${index}.address`)}
                className="w-full"
                error={errors.addresses?.[index]?.address?.message}
              />
              <Input
                label="City"
                placeholder="Enter city"
                {...register(`addresses.${index}.city`)}
                className="w-full"
                error={errors.addresses?.[index]?.city?.message}
              />
              <Input
                label="State"
                placeholder="Enter state"
                {...register(`addresses.${index}.state`)}
                className="w-full"
                error={errors.addresses?.[index]?.state?.message}
              />
              <Input
                label="Postal Code"
                placeholder="Enter postal code"
                {...register(`addresses.${index}.postal`)}
                className="w-full"
                error={errors.addresses?.[index]?.postal?.message}
              />
              <Input
                label="Country"
                placeholder="Enter country"
                {...register(`addresses.${index}.country`)}
                className="w-full"
                error={errors.addresses?.[index]?.country?.message}
              />
              <Input
                label="Latitude"
                placeholder="Enter latitude"
                {...register(`addresses.${index}.latitude`)}
                className="w-full"
                error={errors.addresses?.[index]?.latitude?.message}
              />
              <Input
                label="Longitude"
                placeholder="Enter longitude"
                {...register(`addresses.${index}.longitude`)}
                className="w-full"
                error={errors.addresses?.[index]?.longitude?.message}
              />
              <Button variant="outline" onClick={() => remove(index)}>
                Remove Address
              </Button>
            </div>
          ))}
          <Button
            onClick={() =>
              append({
                address: null,
                city: null,
                state: null,
                postal: null,
                country: null,
                latitude: 0,
                longitude: 0,
              })
            }
          >
            Add Address
          </Button>
        </FormGroup>
      </FormGroup>

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
          Create Carrier
        </Button>
      </div>
    </form>
  );
}