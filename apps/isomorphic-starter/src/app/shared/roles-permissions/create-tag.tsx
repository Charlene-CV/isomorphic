'use client';

import { useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@ui/form';
import { Input, Button, ActionIcon, Title } from 'rizzui';
import { TagFormInput, tagFormSchema } from '@/validators/create-tag.schema';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { useRouter } from 'next/navigation';
// @ts-ignore
import Cookies from "js-cookie";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { Text } from "rizzui";
import { routes } from '@/config/routes';
import { Switch } from 'rizzui';

// main category form component for create and update category
export default function CreateTag() {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

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
    const tag: TagFormInput = {
      name: data.name,
      icon: data.icon,
      // isActive: isActive
    };
    console.log({isActive})
    const user = JSON.parse(Cookies.get("user"));
    const token = user.token;
    const response = await axios.post(
      `http://192.168.0.146:8080/api/v1/tags/create`,
      tag,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (response.status === 200) {
      closeModal();
      toast.success(<Text>Tag added successfully!</Text>);
    } else {
      toast.error(<Text>Error adding tag...</Text>);
    }
  };

  return (
    <Form<TagFormInput>
      resetValues={reset}
      onSubmit={onSubmit}
      validationSchema={tagFormSchema}
      className="flex flex-grow flex-col gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, formState: { errors } }) => {
        return (
          <>
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
            {/* <Switch
              label={isActive}
              variant="flat"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
              labelClassName="font-medium text-sm text-gray-900"
              switchClassName='peer-checked/switch:bg-[#a5a234] peer-checked/switch:border-[#a5a234]'
            /> */}
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
                className="w-full @xl:w-auto"
              >
                Create Tag
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
