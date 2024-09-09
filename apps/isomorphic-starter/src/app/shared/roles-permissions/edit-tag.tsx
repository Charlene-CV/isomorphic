'use client';

import { useState, useEffect } from 'react';
import { PiCheckBold, PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { permissions, roles } from '@/app/shared/roles-permissions/utils';
import { useModal } from '@/app/shared/modal-views/use-modal';
import {
  ActionIcon,
  AdvancedCheckbox,
  Title,
  Button,
  CheckboxGroup,
  Input,
} from 'rizzui';
import { Form } from '@ui/form';
import { TagFormInput, tagFormSchema } from '@/validators/create-tag.schema';

export default function EditTag(tag: TagFormInput) {
   const defaultValues = {
    name: tag.name || '',
    icon: tag.icon || ''
  };
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);

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
    console.log(tag.name)
    reset({ name: tag.name, icon: tag.icon });
  }, []);

  const onSubmit: SubmitHandler<TagFormInput> = (data) => {
    // set timeout ony required to display loading state of the create category button
    
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <>
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
              label="Active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
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
                className="w-full @xl:w-auto bg-[#a5a234]"
              >
                Save
              </Button>
            </div>
          </>
    </form>
  );

  // return (
  //   <Form<TagFormInput>
  //     resetValues={reset}
  //     onSubmit={onSubmit}
  //     validationSchema={tagFormSchema}
  //     className="flex flex-grow flex-col gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
  //   >
  //     {({ register, formState: { errors }, setValue }) => {
  //       return (
  //         <>
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
  //       );
  //     }}
  //   </Form>
  // );
}


