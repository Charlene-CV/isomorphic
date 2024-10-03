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
  () => import('@/app/shared/accessorials/filter-element'),
  { ssr: false }
);

const filterState = {
  category: '',
  status: '',
};

export interface Category {
  uuid: string;
  name: string;
}

export interface Tag {
  name: string;
  icon?: string | null;
  isActive: boolean;
}

export interface Accessorial {
  uuid: string;
  name: string;
  legType: string;
  basePrice?: number | null;
  requiredEquipment: boolean;
  category: Category;
  tags?: Tag[] | null;
}

export default function AccessorialTable({
  accessorials,
  fetchAccessorials,
}: any) {
  const [pageSize, setPageSize] = useState(10);
  const [editAccessorial, setEditAccessorial] = useState<Accessorial | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleEditClick = async (uuid: string) => {
    if (fetchAccessorial) {
      const accessorial = await fetchAccessorial(uuid);
      if (accessorial) {
        setEditAccessorial(accessorial);
        setIsModalOpen(true); // Open the modal
      }
    }
  };

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const handleDeleteAccessorial = async (uuids: string[]) => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      if (uuids.length > 0) {
        const response = await axios.delete(
          `${baseUrl}/api/v1/accessorials/delete`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            data: { uuids },
          }
        );

        if (response.status === 200) {
          fetchAccessorials();
        }
      }
    } catch (error) {
      // Handle error here
      console.error('Error removing accessorials:', error);
    }
  };

  const getAccessorial = async (uuid: string): Promise<Accessorial | null> => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get<{ data: Accessorial }>(
        `${baseUrl}/api/v1/accessorials/find-one/${uuid}`,
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
      console.error('Error fetching accessorial:', error);
      return null;
    }
  };

  const fetchAccessorial = useCallback(
    async (uuid: string): Promise<Accessorial | null> => {
      return await getAccessorial(uuid);
    },
    []
  );

  const onDeleteItem = useCallback((uuid: string) => {
    handleDeleteAccessorial([uuid]);
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
  } = useTable(accessorials, pageSize, filterState);

  const columns = useMemo(
    () =>
      getColumns({
        data: accessorials,
        sortConfig,
        checkedItems: selectedRowKeys,
        handleEditClick,
        handleSelectAll,
        onDeleteItem,
        onHeaderCellClick,
        fetchAccessorial: async (uuid: string) => {
          const accessorial = await fetchAccessorial(uuid);

          if (!accessorial) {
            return null;
          }

          return accessorial;
        },
        fetchAccessorials,
        onChecked: handleRowSelect,
      }) as unknown as ColumnType<DefaultRecordType>[],
    [
      accessorials,
      sortConfig,
      selectedRowKeys,
      handleEditClick,
      handleSelectAll,
      onDeleteItem,
      onHeaderCellClick,
      fetchAccessorial,
      fetchAccessorials,
      handleRowSelect,
    ]
  );

  return (
    <div className="mt-14">
      <FilterElement
        isFiltered={isFiltered}
        filters={filters}
        updateFilter={updateFilter}
        handleReset={handleReset}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        fetchAccessorials={fetchAccessorials}
      />
      <ControlledTable
        variant="modern"
        data={accessorials}
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
