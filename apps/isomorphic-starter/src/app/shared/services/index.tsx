'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@hooks/use-table';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import { ColumnType } from 'rc-table';
import ControlledTable from '../controlled-table';
import { DefaultRecordType } from 'rc-table/lib/interface';
// @ts-ignore
import Cookies from 'js-cookie';
import { getColumns } from './columns';

const FilterElement = dynamic(
  () => import('@/app/shared/services/filter-element'),
  { ssr: false }
);

const filterState = {
  type: '',
  status: '',
};

export interface Type {
  uuid: string;
  name: string;
}

export interface Service {
  uuid: string;
  name: string;
  offering: string;
  connection: string;
  minMarkup?: number | null;
  maxMarkup?: number | null;
  markup?: number | null;
  isActive: boolean;
  typeUuid: string;
}

export default function ServiceTable({ services, fetchServices }: any) {
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editService, setEditService] = useState<Service | null>(null);

  const handleEditClick = async (uuid: string) => {
    if (fetchService) {
      const service = await fetchService(uuid);
      if (service) {
        setEditService(service);
        setIsModalOpen(true);
      }
    }
  };

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const handleDeleteServices = async (uuids: string[]) => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      if (uuids.length > 0) {
        const response = await axios.delete(
          `${baseUrl}/api/v1/services/delete`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { uuids },
          }
        );

        if (response.status === 200) {
          fetchServices();
        }
      }
    } catch (error) {
      // Handle error here
      console.error('Error removing services:', error);
    }
  };

  const getService = async (uuid: string): Promise<Service | null> => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get(
        `${baseUrl}/api/v1/services/find-one/${uuid}`,
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
      console.error('Error fetching service:', error);
      return null;
    }
  };

  const fetchService = useCallback(
    async (uuid: string): Promise<Service | null> => {
      return await getService(uuid);
    },
    []
  );

  const onDeleteItem = useCallback((uuid: string) => {
    handleDeleteServices([uuid]);
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
  } = useTable(services, pageSize, filterState);

  const columns = useMemo(
    () =>
      getColumns({
        data: services,
        sortConfig,
        checkedItems: selectedRowKeys,
        handleEditClick,
        handleSelectAll,
        onDeleteItem,
        onHeaderCellClick,
        fetchService: async (uuid: string) => {
          const service = await fetchService(uuid);

          if (!service) {
            return null;
          }

          return service;
        },
        fetchServices,
        onChecked: handleRowSelect,
      }) as unknown as ColumnType<DefaultRecordType>[],
    [
      services,
      sortConfig,
      selectedRowKeys,
      handleEditClick,
      handleSelectAll,
      onDeleteItem,
      onHeaderCellClick,
      fetchService,
      fetchServices,
      handleRowSelect,
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
        fetchServices={fetchServices}
      />
      <ControlledTable
        variant="modern"
        data={services}
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
