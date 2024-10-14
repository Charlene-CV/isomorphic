"use client";

import { useEffect, useState } from "react";
import { PiXBold } from "react-icons/pi";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Input, Button, ActionIcon, Title, Text, Modal } from "rizzui";
import { OrderFormInput, orderFormSchema } from "@/validators/create-order.schema";
import { useModal } from "@/app/shared/modal-views/use-modal";
import axios from "axios";
import { baseUrl } from "@/config/url";
// @ts-ignore
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import FormGroup from "../form-group";

export default function EditOrder({ fetchOrders, orderData }: any) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<OrderFormInput>({
    defaultValues: {
      name: orderData?.name || "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (orderData) {
      reset({
      });
    }
  }, [orderData, reset]);

  // const { fields, append, remove } = useFieldArray({
  //   name: "addresses",
  //   control
  // });

  const onSubmit: SubmitHandler<OrderFormInput> = async (data) => {
    const formattedData = {
      name: data?.name,
    };
    try {
      const user: any = JSON.parse(Cookies.get("user"));
      const token = user.token;
      const response = await axios.put(
        `${baseUrl}/api/v1/orders/update/${orderData.uuid}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchOrders();
        closeModal();
        toast.success(<Text>Order edited successfully!</Text>);
      } else {
        toast.error(<Text>Error editing order...</Text>);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 p-6">
      <>
        <div className="flex items-center justify-between">
          <Title as="h4" className="font-semibold">
            Edit Order
          </Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal}>
            <PiXBold className="h-auto w-5" />
          </ActionIcon>
        </div>

        <FormGroup title="Order Details" className="space-y-5">
          <Input
            label="Name"
            placeholder="Enter order name"
            {...register("name")}
            className="w-full"
            error={errors.name?.message}
          />
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
            className="w-full md:w-auto bg-[#a5a234]"
          >
            Edit Order
          </Button>
        </div>
      </>
    </form>
  );
}
