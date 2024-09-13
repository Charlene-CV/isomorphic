'use client';

import { useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@ui/form';
import { Input, Button, ActionIcon, Title, Text, Switch } from 'rizzui';
import { TagFormInput, tagFormSchema } from '@/validators/create-tag.schema';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { useRouter } from 'next/navigation';
// @ts-ignore
import Cookies from "js-cookie";
import axios from 'axios';
import { toast } from "react-hot-toast";

export default function CreateTag() {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const onSubmit: SubmitHandler<TagFormInput> = async (data) => {
    // set timeout ony required to display loading state of the create category button
    // setLoading(true);
    // setTimeout(() => {
    //   console.log('data', data);
    //   setLoading(false);
    //   setReset({
    //     tagName: '',
    //     tagIcon: '',
    //   });
    //   closeModal();
    // }, 600);
    const user: any = JSON.parse(Cookies.get("user"));
    const token = user.token;
    const tagData = { 
      name: data?.name, 
      icon: data?.icon,
      isActive: isActive
     };
    const response = await axios.post(
      `http://localhost:3000/api/v1/tags/create`,
      tagData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log({response});
    if (response.status === 200) {
      closeModal();
      window.location.reload();
      toast.success(<Text>Tag added successfully!</Text>);
    } else {
      toast.error(<Text>Error adding tag...</Text>);
    }
  };

const { register, handleSubmit, formState: { errors }, setValue } = useForm<TagFormInput>();

return (
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="flex flex-grow flex-col gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
  >
    <div className="flex items-center justify-between">
      <Title as="h4" className="font-semibold">
        Add A New Tag
      </Title>
      <ActionIcon size="sm" variant="text" onClick={closeModal}>
        <PiXBold className="h-auto w-5" />
      </ActionIcon>
    </div>
    <Input
      label="Tag Name"
      placeholder="Tag name"
      {...register('name')}
      error={errors.name?.message}
    />
    <Input
      label="Tag Icon"
      placeholder="Tag Icon"
      {...register('icon')}
      error={errors.icon?.message}
    />
    <Switch
      label="Active"
      checked={isActive}
      onChange={(e) => {
        setIsActive(e.target.checked);
        setValue('isActive', e.target.checked);
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
        Create Tag
      </Button>
    </div>
  </form>
  );
}
