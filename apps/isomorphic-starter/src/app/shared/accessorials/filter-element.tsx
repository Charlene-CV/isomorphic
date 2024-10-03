'use client';

import { PiTrashDuotone, PiMagnifyingGlassBold } from 'react-icons/pi';
import { Badge, Text, Title, Button, Input } from 'rizzui';
import ModalButton from '@/app/shared/modal-button';
import StatusField from '@/app/shared/controlled-table/status-field';
import { STATUSES } from '@/data/users-data';
import CreateAccessorial from './create-accessorial';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const statusOptions = [
  {
    value: STATUSES.Active,
    label: STATUSES.Active,
  },
  {
    value: STATUSES.Deactivated,
    label: STATUSES.Deactivated,
  },
  {
    value: STATUSES.Pending,
    label: STATUSES.Pending,
  },
];

type Category = {
  uuid: string;
  name: string;
};

type FilterElementProps = {
  isFiltered: boolean;
  filters: { [key: string]: any };
  updateFilter: (columnId: string, filterValue: string | any[]) => void;
  handleReset: () => void;
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
  fetchAccessorials: any;
};

export default function FilterElement({
  isFiltered,
  handleReset,
  filters,
  updateFilter,
  onSearch,
  searchTerm,
  fetchAccessorials,
}: FilterElementProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get(`${baseUrl}/api/v1/categories/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategories(response?.data?.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <div className="relative z-50 mb-4 flex flex-wrap items-center justify-between gap-2.5 @container">
        <Title as="h5" className="-order-6 basis-2/5 @xl:basis-auto">
          All Accessorials
        </Title>

        <StatusField
          className="-order-3 w-full @[25rem]:w-[calc(calc(100%_-_10px)_/_2)] @4xl:-order-5 @4xl:w-auto"
          options={statusOptions}
          dropdownClassName="!z-10 h-auto"
          value={filters['status']}
          onChange={(value: string) => {
            updateFilter('status', value);
          }}
          placeholder="Filter by Status"
          getOptionValue={(option: { value: any }) => option.value}
          getOptionDisplayValue={(option: { value: any }) =>
            renderOptionDisplayValue(option.value as string)
          }
          displayValue={(selected: string) =>
            renderOptionDisplayValue(selected)
          }
        />

        <StatusField
          options={categories.map((category) => ({
            value: category.uuid, // Use `uuid` for the value
            label: category.name, // Use `name` for the label
          }))}
          dropdownClassName="!z-10 w-48"
          value={filters['category']}
          placeholder="Filter by Category"
          className="@4xl:-auto -order-2 w-full min-w-[160px] @[25rem]:w-[calc(calc(100%_-_10px)_/_2)] @4xl:-order-4 @4xl:w-auto"
          getOptionValue={(option: { value: any }) => option.value}
          onChange={(value: string) => {
            updateFilter('category', value);
          }}
          displayValue={(selected: string) =>
            categories.find((option) => option.uuid === selected)?.name ?? ''
          }
        />

        {isFiltered && (
          <Button
            size="sm"
            onClick={handleReset}
            className="-order-1 h-8 w-full bg-gray-200/70 @4xl:-order-4 @4xl:w-auto"
            variant="flat"
          >
            <PiTrashDuotone className="me-1.5 h-[17px] w-[17px]" /> Clear
          </Button>
        )}

        <Input
          type="search"
          placeholder="Search for accessorials..."
          value={searchTerm}
          onClear={() => onSearch('')}
          onChange={(event) => onSearch(event.target.value)}
          prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
          rounded="lg"
          clearable
          className="-order-4 w-full @xl:-order-5 @xl:ms-auto @xl:w-auto @4xl:-order-2 @4xl:w-[230px] @5xl:w-auto"
        />

        <div className="-order-5 flex basis-auto justify-end @xl:-order-4 @4xl:-order-1">
          <ModalButton
            label="Add New Accessorial"
            view={<CreateAccessorial fetchAccessorials={fetchAccessorials} />}
            customSize="600px"
            className="mt-0"
          />
        </div>
      </div>
    </>
  );
}

function renderOptionDisplayValue(value: string) {
  switch (value) {
    case STATUSES.Active:
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark">
            {value}
          </Text>
        </div>
      );
    case STATUSES.Deactivated:
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-red-dark">
            {value}
          </Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium capitalize text-gray-600">
            {value}
          </Text>
        </div>
      );
  }
}
