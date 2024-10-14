'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@hooks/use-table';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import { ColumnType } from 'rc-table';
import ControlledTable from '../../controlled-table';
import { DefaultRecordType } from 'rc-table/lib/interface';
// @ts-ignore
import Cookies from 'js-cookie';
import { IAddress, IBusinessHours } from '@/config/constants';
import { Accessorial } from '../../accessorials';
import { Customer } from '..';
import { getColumns } from './columns';
import { usePathname } from 'next/navigation';

const FilterElement = dynamic(
  () => import('@/app/shared/customers/addresses/filter-element'),
  { ssr: false }
);

const filterState = {
  status: '',
};

export interface Addresses {
  uuid: string;
  company: string;
  contactName?: string | null;
  phone?: string | null;
  phoneExt?: string | null;
  fax?: string | null;
  email?: string | null;
  address?: IAddress[] | [];
  businessHours?: IBusinessHours | null;
  externalId?: string | null;
  customBroker?: string | null;
  bolInstruction?: string | null;
  shipperNotes?: string | null;
  consigneeNotes?: string | null;
  customer: Customer;
  accessorials: Accessorial[] | null;
}

export default function AddressTable() {
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [address, setAddress] = useState([]);
  const [editAddress, setEditAddress] = useState<Addresses | null>(null);

  const pathname = usePathname();
  const segments = pathname.split('/');
  const uuidval = segments[2];
  useEffect(() => {
    if (uuidval) {
      setuuidval(uuidval);
    }
  }, [uuidval]);

  const [uuid, setuuidval] = useState(uuidval ?? '');

  const fetchAddresses = async () => {
    if (!uuid) return;

    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;

    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/customer-addresses/customer/${uuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAddress(response?.data?.data);
    } catch (error) {
      console.error('Error fetching customer people:', error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const getAddress = async (uuid: string): Promise<Addresses | null> => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      const response = await axios.get<{ data: Addresses }>(
        `${baseUrl}/api/v1/customer-addresses/find-one/${uuid}`,
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
      console.error('Error fetching address:', error);
      return null;
    }
  };

  const fetchAddress = useCallback(
    async (uuid: string): Promise<Addresses | null> => {
      return await getAddress(uuid);
    },
    []
  );

  const handleDeleteAddress = async (uuids: string[]) => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/customer-addresses/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { uuids },
        }
      );

      if (response.status === 200) {
        fetchAddresses();
      }
    } catch (error) {
      // Handle error here
      console.error('Error removing address:', error);
    }
  };

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const handleEditClick = async (uuid: string) => {
    if (fetchAddress) {
      const newAddress = await fetchAddress(uuid);

      if (newAddress) {
        setEditAddress(newAddress);
        setIsModalOpen(true);
      }
    }
  };

  const onDeleteItem = useCallback((uuid: string) => {
    handleDeleteAddress([uuid]);
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
  } = useTable(address, pageSize, filterState);

  const columns = useMemo(
    () =>
      getColumns({
        data: address,
        sortConfig,
        checkedItems: selectedRowKeys,
        onHeaderCellClick,
        onDeleteItem,
        onChecked: handleRowSelect,
        handleSelectAll,
        handleEditClick,
        fetchAddress: async (uuid: string) => {
          const address = await fetchAddress(uuid);
          if (address) return address;
          return null;
        },
        fetchAddresses,
      }) as unknown as ColumnType<DefaultRecordType>[],
    [
      address,
      sortConfig,
      selectedRowKeys,
      onHeaderCellClick,
      onDeleteItem,
      handleRowSelect,
      handleSelectAll,
      handleEditClick,
      fetchAddress,
      fetchAddresses,
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
        fetchAddresses={fetchAddresses}
        uuid={uuid}
      />
      <ControlledTable
        variant="modern"
        data={address}
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
