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
import { Customer } from '..';
import { getColumns } from './columns';
import { usePathname } from 'next/navigation';

const FilterElement = dynamic(
  () => import('@/app/shared/customers/people/filter-element'),
  { ssr: false }
);

const filterState = {
  status: '',
};

export interface People {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  job: string | null;
  notes: string | null;
  status: string | null;
  isActive: boolean;
  sendReports: boolean;
  sendInvoices: boolean;
  hasPortalAccess: boolean;
  customer: Customer;
}

export default function PeopleTable() {
  const [people, setPeople] = useState([]);
  const pathname = usePathname();
  const segments = pathname.split('/');
  const uuidval = segments[2];
  useEffect(() => {
    if (uuidval) {
      setuuidval(uuidval);
    }
  }, [uuidval]);

  const [uuid, setuuidval] = useState(uuidval ?? '');
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editPeople, setEditPeople] = useState<People | null>(null);

  const fetchCustomerPeople = async () => {
    if (!uuid) return;

    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;

    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/people/customer/${uuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPeople(response?.data?.data);
    } catch (error) {
      console.error('Error fetching customer people:', error);
    }
  };

  useEffect(() => {
    fetchCustomerPeople();
  }, []);

  const getPerson = async (uuid: string): Promise<People | null> => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      const response = await axios.get<{ data: People }>(
        `${baseUrl}/api/v1/people/find-one/${uuid}`,
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
      console.error('Error fetching person:', error);
      return null;
    }
  };

  const fetchPerson = useCallback(
    async (uuid: string): Promise<People | null> => {
      return await getPerson(uuid);
    },
    []
  );

  const handleDeletePeople = async (uuids: string[]) => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      const response = await axios.delete(`${baseUrl}/api/v1/people/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { uuids },
      });

      if (response.status === 200) {
        fetchCustomerPeople();
      }
    } catch (error) {
      // Handle error here
      console.error('Error removing people:', error);
    }
  };

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const handleEditClick = async (uuid: string) => {
    if (fetchPerson) {
      const person = await fetchPerson(uuid);

      if (person) {
        setEditPeople(person);
        setIsModalOpen(true);
      }
    }
  };

  const onDeleteItem = useCallback((uuid: string) => {
    handleDeletePeople([uuid]);
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
  } = useTable(people, pageSize, filterState);

  const columns = useMemo(
    () =>
      getColumns({
        data: people,
        sortConfig,
        checkedItems: selectedRowKeys,
        onHeaderCellClick,
        onDeleteItem,
        onChecked: handleRowSelect,
        handleSelectAll,
        handleEditClick,
        fetchPerson: async (uuid: string) => {
          const person = await fetchPerson(uuid);
          if (person) {
            return person;
          }
          return null;
        },
        fetchCustomerPeople,
      }) as unknown as ColumnType<DefaultRecordType>[],
    [
      people,
      sortConfig,
      selectedRowKeys,
      onHeaderCellClick,
      onDeleteItem,
      handleRowSelect,
      handleSelectAll,
      handleEditClick,
      fetchPerson,
      fetchCustomerPeople,
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
        fetchCustomerPeople={fetchCustomerPeople}
        uuid={uuid}
      />
      <ControlledTable
        variant="modern"
        data={people}
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
