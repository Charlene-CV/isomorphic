'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@ui/form';
import { Input, Button, ActionIcon, Title } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { PiXBold } from 'react-icons/pi';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import {
  CategoryFormInput,
  categoryFormSchema,
} from '@/validators/create-category.schema';

interface EditCategoriesProps {
  categoryUuid?: string;
  fetchCategories: any;
  fetchAccessorials: any;
}

export default function EditCategory({
  categoryUuid,
  fetchCategories,
  fetchAccessorials,
}: EditCategoriesProps) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState<string>('');

  const fetchCategory = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get(
        `${baseUrl}/api/v1/categories/find-one/${categoryUuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const category = response?.data?.data;
      setName(category?.name);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [categoryUuid]);

  const onSubmit: SubmitHandler<CategoryFormInput> = async (data) => {
    setLoading(true);

    const categoryData = {
      name: data?.name,
    };

    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      const response = await axios.put(
        `${baseUrl}/api/v1/categories/update/${categoryUuid}`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchCategories();
        fetchAccessorials();
        closeModal();
      }
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<CategoryFormInput>
      onSubmit={onSubmit}
      validationSchema={categoryFormSchema}
      className="flex flex-grow flex-col gap-6 p-6 @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, formState: { errors } }) => (
        <>
          <div className="flex items-center justify-between">
            <Title as="h4" className="font-semibold">
              Edit Category
            </Title>
            <ActionIcon size="sm" variant="text" onClick={closeModal}>
              <PiXBold className="h-auto w-5" />
            </ActionIcon>
          </div>
          <Input
            label="Category Name"
            placeholder="Category Name"
            {...register('name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors?.name?.message}
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
              className="w-full @xl:w-auto"
            >
              Update Category
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
