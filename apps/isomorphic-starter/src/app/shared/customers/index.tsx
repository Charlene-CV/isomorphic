'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@hooks/use-table';
import { getColumns } from '@/app/shared/customers/columns';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import { ColumnType } from 'rc-table';
import ControlledTable from '../controlled-table';
import { DefaultRecordType } from 'rc-table/lib/interface';
// @ts-ignore
import Cookies from 'js-cookie';
import { IAddress, IBusinessHours } from '@/config/constants';
import { People } from './people';
import { Addresses } from './addresses';

const FilterElement = dynamic(
  () => import('@/app/shared/customers/filter-element'),
  { ssr: false }
);

const filterState = {
  role: '',
  status: '',
};

interface Tag {
  uuid: string;
  name: string;
}

interface Accessorial {
  uuid: string;
  name: string;
}

export interface Customer {
  uuid: string;
  name: string;
  shortCode: string;
  balance?: number | null;
  creditLimit?: number | null;
  externalId?: string | null;
  quickbookId?: string | null;
  customerType?: string | null;
  billingOption?: string | null;
  businessHours?: IBusinessHours | null;
  notes?: string | null;
  weight: string; // default(lbs)
  length: string; // default(in)
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  requireQuote: boolean;
  currency: string; // default(CAD)
  isActive: boolean;
  requireDimensions: boolean;
  hasPortalAccess: boolean;
  liveLocation?: string | null;
  logo?: string | null;
  addresses?: IAddress | null;
  serviceType?: string | null;
  accessorials: Accessorial[] | [];
  tags: Tag[] | [];
  people: People[] | [];
  customerAddresses: Addresses[] | [];
}

export default function CustomerTable({ customers, fetchCustomers }: any) {
  const [pageSize, setPageSize] = useState(10);

  const handleDeleteCustomer = async (uuids: string[]) => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      if (uuids.length > 0) {
        const response = await axios.delete(
          `${baseUrl}/api/v1/customers/delete`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            data: { uuids },
          }
        );

        if (response.status === 200) {
          fetchCustomers();
        }
      }
    } catch (error) {
      // Handle error here
      console.error('Error removing customers:', error);
    }
  };

  const getCustomer = async (uuid: string): Promise<Customer | null> => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get<{ data: Customer }>(
        `${baseUrl}/api/v1/customers/find-one/${uuid}`,
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
      console.error('Error fetching user:', error);
      return null;
    }
  };

  const fetchCustomer = useCallback(
    async (uuid: string): Promise<Customer | null> => {
      return await getCustomer(uuid);
    },
    []
  );

  const onDeleteItem = useCallback((uuid: string) => {
    handleDeleteCustomer([uuid]);
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
  } = useTable(customers, pageSize, filterState);

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const columns = useMemo(
    () =>
      getColumns({
        data: customers,
        sortConfig,
        checkedItems: selectedRowKeys,
        onHeaderCellClick,
        onDeleteItem,
        onChecked: handleRowSelect,
        handleSelectAll,
        fetchCustomer: async (uuid: string) => {
          const customer = await fetchCustomer(uuid);
          if (customer) {
            // Do something with the customer
            return customer;
          }
          // Handle the case where no customer is returned
          return null;
        },
        fetchCustomers,
      }) as unknown as ColumnType<DefaultRecordType>[],
    [
      customers,
      sortConfig,
      selectedRowKeys,
      onHeaderCellClick,
      onDeleteItem,
      handleRowSelect,
      handleSelectAll,
      fetchCustomer,
      fetchCustomers,
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
        fetchCustomers={fetchCustomers}
      />
      <ControlledTable
        variant="modern"
        data={customers}
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
