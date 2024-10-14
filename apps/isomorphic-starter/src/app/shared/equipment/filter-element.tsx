'use client';

import { PiTrashDuotone, PiMagnifyingGlassBold } from 'react-icons/pi';
import { Badge, Text, Title, Button, Input } from 'rizzui';
import ModalButton from '@/app/shared/modal-button';
import CreateEquip from './create-equip';
import { useEffect, useState } from 'react';

type FilterElementProps = {
  isFiltered: boolean;
  filters: { [key: string]: any };
  updateFilter: (columnId: string, filterValue: string | any[]) => void;
  handleReset: () => void;
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
  fetchEquipments: any;
};

export default function FilterElement({
  isFiltered,
  handleReset,
  filters,
  updateFilter,
  onSearch,
  searchTerm,
  fetchEquipments,
}: FilterElementProps) {
  return (
    <>
      <div>
        <div className="relative mb-4 flex items-center justify-between whitespace-nowrap gap-2.5">

          {/* <Input
            type="text"
            placeholder="Filter by Name"
            value={filters['name'] || ''}
            onChange={(event) => updateFilter('name', event.target.value)}
            rounded="lg"
            className="w-full @4xl:w-auto order-1"
          /> */}

          {/* <Input
            type="text"
            placeholder="Filter by Origin"
            value={filters['origin'] || ''}
            onChange={(event) => updateFilter('origin', event.target.value)}
            rounded="lg"
            className="w-full @4xl:w-auto order-2"
          />

          <Input
            type="text"
            placeholder="Filter by Destination"
            value={filters['destination'] || ''}
            onChange={(event) => updateFilter('destination', event.target.value)}
            rounded="lg"
            className="w-full @4xl:w-auto order-3"
          /> */}

          <div className="flex basis-auto justify-end order-4 ">
            <ModalButton
              label="Add New Equipment"
              view={<CreateEquip fetchEquipments={fetchEquipments} />}
              customSize="600px"
              className="mt-0 bg-[#a5a234]" 
            />
          </div>

          {isFiltered && (
            <Button
              size="sm"
              onClick={handleReset}
              className="h-8 w-full bg-gray-200/70 @4xl:w-auto order-5"
              variant="flat"
            >
              <PiTrashDuotone className="me-1.5 h-[17px] w-[17px]" /> Clear
            </Button>
          )}

          <Input
            type="search"
            placeholder="Search for equipment..."
            value={searchTerm}
            onClear={() => onSearch('')}
            onChange={(event) => onSearch(event.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-3 w-3" />}
            rounded="lg"
            clearable
            className="w-auto @xl:ms-auto @xl:w-auto @4xl:w-[230px] @5xl:w-auto text-black bg-white order-6"
          />
        </div>
      </div>

    </>
  );
}
