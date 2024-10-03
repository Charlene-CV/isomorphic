'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@ui/form';
import { Input, Button, ActionIcon, Title, Select, Switch } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import {
  CreateAccessorialInput,
  createAccessorialSchema,
} from '@/validators/create-accessorial.schema';

interface Category {
  uuid: string;
  name: string;
}

interface Tag {
  uuid: string;
  name: string;
}

export default function CreateAccessorial({ fetchAccessorials }: any) {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagUuids, setSelectedTagUuids] = useState<string[]>([]);
  const [active, setActive] = useState<boolean>(false);

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
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  const onSubmit: SubmitHandler<CreateAccessorialInput> = async (data) => {
    setLoading(true);
    const accessoData = {
      name: data?.name,
      legType: data?.legType,
      requiredEquipment: data?.requiredEquipment,
      categoryUuid: data?.categoryUuid,
      basePrice: data?.basePrice,
      tagsUuids: data?.tagsUuids,
    };
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      await axios.post(`${baseUrl}/api/v1/accessorials/create`, accessoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReset({
        name: '',
        legType: '',
        requiredEquipment: false,
        categoryUuid: '',
        basePrice: '',
        tagsUuids: [],
      });

      fetchAccessorials();
      closeModal();
    } catch (error) {
      console.error('Error durin form submission: ', error);
    }
  };

  return (
    <Form<CreateAccessorialInput>
      resetValues={reset}
      onSubmit={onSubmit}
      validationSchema={createAccessorialSchema}
      className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, control, formState: { errors } }) => {
        return (
          <>
            <div className="col-span-full flex items-center justify-between">
              <Title as="h4" className="font-semibold">
                Add new Accessorial
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
                  setValueAs: (value) => parseFloat(value), // Convert to number
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
                      categories.find(
                        (category) => category.uuid === selectedValue
                      )?.name ?? ''
                    }
                    dropdownClassName="!z-[1]"
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="tagsUuids"
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
                      value={tags.filter((tag) =>
                        field.value?.includes(tag.uuid)
                      )} // Ensure selected tags are shown
                      onChange={(selectedOption: any) => {
                        const selectedValues = Array.isArray(field.value)
                          ? [...field.value]
                          : [];

                        if (Array.isArray(selectedOption)) {
                          // Add the selected values to the existing list
                          selectedOption.forEach((option: any) => {
                            if (!selectedValues.includes(option.value)) {
                              selectedValues.push(option.value);
                            }
                          });
                        } else if (
                          selectedOption?.value &&
                          !selectedValues.includes(selectedOption.value)
                        ) {
                          // Add a single selected value if it doesn't exist already
                          selectedValues.push(selectedOption.value);
                        }

                        setSelectedTagUuids(selectedValues); // Update state with all selected tags
                        field.onChange(selectedValues); // Update form state
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
                    />

                    {/* Display selected tags with remove option */}
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
                                  field.value.filter(
                                    (id: string) => id !== uuid
                                  );
                                setSelectedTagUuids(updatedValues || []); // Update state with removed tag
                                field.onChange(updatedValues); // Update form with removed tag
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
                    <Switch
                      checked={value}
                      onChange={onChange}
                      className="mr-2"
                    />
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
                Create Accessorial
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
