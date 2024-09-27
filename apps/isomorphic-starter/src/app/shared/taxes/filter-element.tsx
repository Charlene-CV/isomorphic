'use client';

import { PiTrashDuotone, PiMagnifyingGlassBold } from 'react-icons/pi';
import { Badge, Text, Title, Button, Input } from 'rizzui';
import ModalButton from '@/app/shared/modal-button';
import CreateTax from './create-tax';

type FilterElementProps = {
  isFiltered: boolean;
  filters: { [key: string]: any };
  updateFilter: (columnId: string, filterValue: string | any[]) => void;
  handleReset: () => void;
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
  fetchTaxes: any;
};

export default function FilterElement({
  isFiltered,
  handleReset,
  filters,
  updateFilter,
  onSearch,
  searchTerm,
  fetchTaxes,
}: FilterElementProps) {
  return (
    <>
      <div className="relative z-50 mb-4 flex flex-wrap items-center justify-between gap-2.5 @container">
        <Title as="h5" className="-order-6 basis-2/5 @xl:basis-auto">
          All Taxes
        </Title>

        <Input
          type="text"
          placeholder="Filter by Name"
          value={filters['name'] || ''}
          onChange={(event) => updateFilter('name', event.target.value)}
          rounded="lg"
          className="w-full @4xl:w-auto"
        />

        <Input
          type="text"
          placeholder="Filter by Origin"
          value={filters['origin'] || ''}
          onChange={(event) => updateFilter('origin', event.target.value)}
          rounded="lg"
          className="w-full @4xl:w-auto"
        />

        <Input
          type="text"
          placeholder="Filter by Destination"
          value={filters['destination'] || ''}
          onChange={(event) => updateFilter('destination', event.target.value)}
          rounded="lg"
          className="w-full @4xl:w-auto"
        />

        {isFiltered && (
          <Button
            size="sm"
            onClick={handleReset}
            className="-order-1 h-8 w-full bg-gray-200/70 @4xl:w-auto"
            variant="flat"
          >
            <PiTrashDuotone className="me-1.5 h-[17px] w-[17px]" /> Clear
          </Button>
        )}

        <Input
          type="search"
          placeholder="Search for taxes..."
          value={searchTerm}
          onClear={() => onSearch('')}
          onChange={(event) => onSearch(event.target.value)}
          prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
          rounded="lg"
          clearable
          className="-order-4 w-full @xl:ms-auto @xl:w-auto @4xl:w-[230px] @5xl:w-auto"
        />

        <div className="-order-5 flex basis-auto justify-end @xl:-order-4 @4xl:-order-1">
          <ModalButton
            label="Add New Tax"
            view={<CreateTax fetchTaxes={fetchTaxes} />}
            customSize="600px"
            className="mt-0"
          />
        </div>
      </div>
    </>
  );
}
