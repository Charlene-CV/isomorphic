'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@hooks/use-table';
import { getColumns } from '@/app/shared/tariffs/columns';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import { ColumnType } from 'rc-table';
import ControlledTable from '../controlled-table';
import { DefaultRecordType } from 'rc-table/lib/interface';
// @ts-ignore
import Cookies from 'js-cookie';
import { Accessorial } from '../accessorials';
import { Customer } from '../customers';
import { CwtRange } from './cwtRange';

const FilterElement = dynamic(
  () => import('@/app/shared/tariffs/filter-element'),
  { ssr: false }
);

const filterState = {
  role: '',
  status: '',
};

export interface Tariffs {
  uuid: string;
  name: string;
  type: string;
  notes?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  fuelTable: string;
  basePerc?: number | null;
  adjustmentPerc?: number | null;
  ratePerc?: number | null;
  rangMultiplier: number;
  isActive: boolean;
  isImporting: boolean;
  customer: Customer;
  accessorials: Accessorial[] | null;
  cwtRanges?: CwtRange[] | [];
  // cwtLanes?: CwtLanes[] | [];
}

export default function TariffTable({ tariffs, fetchTariffs }: any) {
  const [pageSize, setPageSize] = useState(10);

  const handleDeleteTariff = async (uuids: string[]) => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      if (uuids.length > 0) {
        const response = await axios.delete(
          `${baseUrl}/api/v1/tariffs/delete`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            data: { uuids },
          }
        );

        if (response.status === 200) {
          fetchTariffs();
        }
      }
    } catch (error) {
      // Handle error here
      console.error('Error removing tariffs:', error);
    }
  };

  const getTariff = async (uuid: string): Promise<Tariffs | null> => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get<{ data: Tariffs }>(
        `${baseUrl}/api/v1/tariffs/find-one/${uuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      // Handle error here
      console.error('Error fetching Tariff:', error);
      return null;
    }
  };

  const fetchTariff = useCallback(
    async (uuid: string): Promise<Tariffs | null> => {
      return await getTariff(uuid);
    },
    []
  );

  const onDeleteItem = useCallback((uuid: string) => {
    handleDeleteTariff([uuid]);
  }, []);

  const {
    isLoading,
    isFiltered,
    currentPage,
    totalItems,
    handlePaginate,
    filters,
    updateFilter,
    searchTerm,
    handleSearch,
    sortConfig,
    handleSort,
    selectedRowKeys,
    handleRowSelect,
    handleSelectAll,
    handleReset,
  } = useTable(tariffs, pageSize, filterState);

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const columns = useMemo(
    () =>
      getColumns({
        data: tariffs,
        sortConfig,
        checkedItems: selectedRowKeys,
        onHeaderCellClick,
        onDeleteItem,
        onChecked: handleRowSelect,
        handleSelectAll,
        fetchTariff: async (uuid: string) => {
          const tariff = await fetchTariff(uuid);

          if (tariff) {
            return tariff;
          }

          return null;
        },
        fetchTariffs,
      }) as unknown as ColumnType<DefaultRecordType>[],
    [
      tariffs,
      sortConfig,
      selectedRowKeys,
      onHeaderCellClick,
      onDeleteItem,
      handleRowSelect,
      handleSelectAll,
      fetchTariff,
      fetchTariffs,
    ]
  );

  return (
    <div>
      <FilterElement
        isFiltered={isFiltered}
        filters={filters}
        updateFilter={updateFilter}
        handleReset={handleReset}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        fetchTariffs={fetchTariffs}
      />

      <ControlledTable
        variant="modern"
        data={tariffs}
        isLoading={isLoading}
        showLoadingText={true}
        columns={columns}
        paginatorOptions={{
          pageSize,
          setPageSize,
          total: totalItems,
          current: currentPage,
          onChange: (page: number) => handlePaginate(page),
        }}
        className="rounded-md border border-muted text-sm shadow-sm [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:h-60 [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:justify-center [&_.rc-table-row:last-child_td.rc-table-cell]:border-b-0 [&_thead.rc-table-thead]:border-t-0"
      />
    </div>
  );
}
