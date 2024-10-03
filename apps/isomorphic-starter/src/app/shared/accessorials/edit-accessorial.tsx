'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Input, Button, ActionIcon, Title, Select, Switch } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import { CreateAccessorialInput } from '@/validators/create-accessorial.schema';

interface Category {
  uuid: string;
  name: string;
}

interface Tag {
  uuid: string;
  name: string;
}

interface EditAccessorialProps {
  accessorial: any; // Accessorial
  fetchAccessorials: any;
}

export default function EditAccessorial({
  accessorial,
  fetchAccessorials,
}: EditAccessorialProps) {
  const { closeModal } = useModal();
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagUuids, setSelectedTagUuids] = useState<string[]>([]);
  const [active, setActive] = useState<boolean>(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset, // reset method from useForm
  } = useForm<CreateAccessorialInput>({
    defaultValues: {
      name: accessorial?.name || '',
      basePrice: accessorial?.basePrice || 0,
      legType: accessorial?.legType || '',
      requiredEquipment: accessorial?.requiredEquipment || false,
      categoryUuid: accessorial?.category?.uuid || '',
      tagsUuids: accessorial?.tags?.map((tag: any) => tag?.uuid) || [],
    },
    mode: 'onBlur',
  });

  // Fetch categories and tags from API
  const fetchCategoriesAndTags = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const [categoriesResponse, tagsResponse] = await Promise.all([
        axios.get<{ data: Category[] }>(`${baseUrl}/api/v1/categories/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<{ data: Tag[] }>(`${baseUrl}/api/v1/tags/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCategories(categoriesResponse.data.data);
      setTags(tagsResponse.data.data);
    } catch (error) {
      console.error('Error fetching categories and tags:', error);
    }
  };

  // Populate form with accessorial data when modal opens
  useEffect(() => {
    fetchCategoriesAndTags();

    // Reset form fields when data is available
    if (accessorial) {
      reset({
        name: accessorial.name || '',
        basePrice: accessorial.basePrice || 0,
        legType: accessorial.legType || '',
        requiredEquipment: accessorial.requiredEquipment || false,
        categoryUuid: accessorial.category?.uuid || '',
        tagsUuids: accessorial.tags?.map((tag: any) => tag?.uuid) || [],
      });
      setSelectedTagUuids(accessorial.tags?.map((tag: any) => tag?.uuid) || []);
    }
  }, []);

  const onSubmit: SubmitHandler<CreateAccessorialInput> = async (data) => {
    setLoading(true);
    const formattedData = {
      name: data?.name,
      legType: data?.legType,
      basePrice: data?.basePrice,
      requiredEquipment: data?.requiredEquipment,
      categoryUuid: data?.categoryUuid,
      tagsUuids: data?.tagsUuids,
    };

    try {
      const userToken: any = JSON.parse(Cookies.get('user'));
      const token = userToken.token;

      await axios.put(
        `${baseUrl}/api/v1/accessorials/update/${accessorial?.uuid}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAccessorials();
      closeModal();
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      <>
        <div className="col-span-full flex items-center justify-between">
          <Title as="h4" className="font-semibold">
            Edit Accessorial
          </Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal}>
            <PiXBold className="h-auto w-5" />
          </ActionIcon>
        </div>

        <div>
          <Input
            label="Name"
            placeholder="Name"
            {...register('name')}
            className="col-span-full mb-5 text-xl md:col-span-1"
            error={errors.name?.message}
          />
          <Input
            label="Leg Type"
            placeholder="Leg Type"
            {...register('legType')}
            error={errors.legType?.message}
          />
        </div>

        <div>
          <Input
            label="Base Price"
            placeholder="Base Price"
            {...register('basePrice', {
              setValueAs: (value) => parseFloat(value),
            })}
            error={errors.basePrice?.message}
            className="col-span-full mb-5 text-xl md:col-span-1"
          />
          <Controller
            name="categoryUuid"
            control={control}
            render={({ field: { name, onChange, value } }) => (
              <Select
                options={categories.map((category) => ({
                  value: category.uuid,
                  label: category.name,
                }))}
                value={value}
                onChange={onChange}
                name={name}
                label="Category"
                className="col-span-full md:col-span-1"
                error={errors?.categoryUuid?.message}
                getOptionValue={(option) => option.value}
                displayValue={(selectedValue) =>
                  categories.find((category) => category.uuid === selectedValue)
                    ?.name ?? ''
                }
                dropdownClassName="!z-[1]"
              />
            )}
          />
        </div>

        <div>
          <Controller
            name="tagsUuids"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  {...field}
                  label="Select Tags"
                  placeholder="Select tags"
                  options={tags.map((tag) => ({
                    value: tag.uuid,
                    label: tag.name,
                  }))}
                  value={tags.filter((tag) => field.value?.includes(tag.uuid))}
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
                    setSelectedTagUuids(selectedValues);
                    field.onChange(selectedValues);
                  }}
                  displayValue={() =>
                    field.value
                      ? field.value
                          .map(
                            (uuid: string) =>
                              tags.find((tag) => tag.uuid === uuid)?.name
                          )
                          .filter(Boolean)
                          .join(', ') // Display tag names for selected UUIDs
                      : ''
                  }
                  error={errors.tagsUuids?.message}
                  // dropdownClassName="!z-[1]"
                />

                <div className="selected-tags mt-2 flex flex-wrap gap-2">
                  {field.value?.map((uuid: string) => {
                    const tag = tags.find((tag) => tag.uuid === uuid);
                    return (
                      <div
                        key={uuid}
                        className="bg-gray-200 text-gray-800 py-1 px-2 rounded flex items-center"
                      >
                        {tag?.name}
                        <button
                          className="ml-2 text-red-500"
                          onClick={() => {
                            const updatedValues =
                              field.value &&
                              field.value.filter((id: string) => id !== uuid);
                            setSelectedTagUuids(updatedValues || []);
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

          <Controller
            name="requiredEquipment"
            control={control}
            render={({ field: { value = active, onChange } }) => (
              <div className="flex items-center">
                <Switch checked={value} onChange={onChange} className="mr-2" />
                <label>Equipment</label>
              </div>
            )}
          />
        </div>

        <div className="col-span-full flex items-center justify-end gap-4">
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
            Save Changes
          </Button>
        </div>
      </>
    </form>
  );
}
