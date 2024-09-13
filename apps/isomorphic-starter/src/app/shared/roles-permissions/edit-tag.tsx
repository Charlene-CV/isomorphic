"use client";

import { useState, useEffect } from "react";
import { PiCheckBold, PiXBold } from "react-icons/pi";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { permissions, roles } from "@/app/shared/roles-permissions/utils";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { ActionIcon, Title, Button, Input, Switch, Text } from "rizzui";
import { Form } from "@ui/form";
import { TagFormInput, tagFormSchema } from "@/validators/create-tag.schema";
import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";
import toast from 'react-hot-toast';

export default function EditTag(tag: TagFormInput) {
  const defaultValues = {
    name: tag.name || "",
    icon: tag.icon || "",
  };
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useForm<TagFormInput>({
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    reset({ name: tag.name, icon: tag.icon });
  }, [reset, tag]);

  const onSubmit: SubmitHandler<TagFormInput> = async (data) => {
    const tagData = { 
      name: data?.name, 
      icon: data?.icon,
      isActive: isActive
     };
    const user: any = JSON.parse(Cookies.get("user"));
    const uuid = user.id;
    const token = user.token;
    const response =  await axios.put(
      `http://192.168.0.146:8080/api/v1/tags/update/${tag.uuid}`,
      tagData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (response.status === 200) {
      closeModal();
      window.location.reload();
      toast.success(<Text>Tag updated successfully!</Text>);
    } else {
      toast.error(<Text>Error updating tag.</Text>, { duration: 5000 });
    }
  };

  function setValue(arg0: string, checked: boolean) {
    throw new Error("Function not implemented.");
  }

  // return (
  //   <form onSubmit={handleSubmit(onSubmit)}>
  //     <>
  //           <div className="flex items-center justify-between">
  //             <Title as="h4" className="font-semibold">
  //               Edit Tag
  //             </Title>
  //             <ActionIcon size="sm" variant="text" onClick={closeModal}>
  //               <PiXBold className="h-auto w-5" />
  //             </ActionIcon>
  //           </div>
  //           <Input
  //             label="Tag Name"
  //             placeholder="Tag Name"
  //             {...register('name')}
  //             error={errors.name?.message}
  //           />
  //           <Input
  //             label="Tag Icon"
  //             placeholder="Tag Icon"
  //             {...register('icon')}
  //             error={errors.icon?.message}
  //           />
  //           {/* <Switch
  //             label="Active"
  //             checked={isActive}
  //             onChange={(e) => setIsActive(e.target.checked)}
  //           /> */}
  //           <div className="flex items-center justify-end gap-4">
  //             <Button
  //               variant="outline"
  //               onClick={closeModal}
  //               className="w-full @xl:w-auto"
  //             >
  //               Cancel
  //             </Button>
  //             <Button
  //               type="submit"
  //               isLoading={isLoading}
  //               className="w-full @xl:w-auto bg-[#a5a234]"
  //             >
  //               Save
  //             </Button>
  //           </div>
  //         </>
  //   </form>
  // );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-grow flex-col gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      <div className="flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          Edit Tag
        </Title>
        <ActionIcon size="sm" variant="text" onClick={closeModal}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
      <Input
        label="Tag Name"
        placeholder="Tag Name"
        {...register("name")}
        error={errors.name?.message}
      />
      <Input
        label="Tag Icon"
        placeholder="Tag Icon"
        {...register("icon")}
        error={errors.icon?.message}
      />
      <Switch
        label="Active"
        checked={isActive}
        onChange={(e) => {
          setIsActive(e.target.checked);
          setValue("isActive", e.target.checked);
        }}
      />
      <div className="flex items-center justify-end gap-4">
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
          className="w-full @xl:w-auto bg-[#a5a234]"
        >
          Save
        </Button>
      </div>
    </form>
  );
}
