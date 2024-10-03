'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@hooks/use-table';
import { getColumns } from '@/app/shared/users/columns';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import { ColumnType } from 'rc-table';
import ControlledTable from '../controlled-table';
import { DefaultRecordType } from 'rc-table/lib/interface';
// @ts-ignore
import Cookies from 'js-cookie';

const FilterElement = dynamic(
  () => import('@/app/shared/users/filter-element'),
  { ssr: false }
);

const filterState = {
  role: '',
  status: '',
};

interface FunctionList {
  uuid: string;
  name: string;
  createdAt: string;
}

interface Permission {
  uuid: string;
  write: boolean;
  edit: boolean;
  read: boolean;
  delete: boolean;
  createdAt: string;
  functinList: FunctionList;
}

export interface Role {
  uuid: string;
  name: string;
  createdAt: string;
  permissions: Permission[];
}

export interface User {
  uuid: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  externalId: string | null;
  quickbookId: string | null;
  phone: string | null;
  grossRevenu: string | null;
  grossMargin: string | null;
  flatRate: string | null;
  fastCard: string | null;
  fuelCardNumber: string | null;
  notes: string | null;
  mobile: string | null;
  driverType: string | null;
  payType: string | null;
  fuelDeduction: string | null;
  paymentSchedule: string | null;
  insurance: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  role: Role;
}

export default function UsersTable({ users, fetchUsers }: any) {
  const [pageSize, setPageSize] = useState(10);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleEditClick = async (uuid: string) => {
    if (fetchUser) {
      const user = await fetchUser(uuid);
      if (user) {
        setEditUser(user);
        setIsModalOpen(true); // Open the modal
      }
    }
  };

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const handleDeleteUser = async (uuids: string[]) => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      if (uuids.length > 0) {
        const response = await axios.delete(`${baseUrl}/api/v1/users/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { uuids },
        });

        if (response.status === 200) {
          fetchUsers();
        }
      }
    } catch (error) {
      // Handle error here
      console.error('Error removing users:', error);
    }
  };

  const getUser = async (uuid: string): Promise<User | null> => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get<{ data: User }>(
        `${baseUrl}/api/v1/users/find-one/${uuid}`,
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

  const fetchUser = useCallback(async (uuid: string): Promise<User | null> => {
    return await getUser(uuid);
  }, []);

  const onDeleteItem = useCallback((uuid: string) => {
    handleDeleteUser([uuid]);
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
  } = useTable(users, pageSize, filterState);

  const columns = useMemo(
    () =>
      getColumns({
        data: users,
        sortConfig,
        checkedItems: selectedRowKeys,
        onHeaderCellClick,
        onDeleteItem,
        onChecked: handleRowSelect,
        handleSelectAll,
        fetchUser: async (uuid: string) => {
          const user = await fetchUser(uuid);
          if (user) {
            // Do something with the user
            return user;
          }
          // Handle the case where no user is returned
          return null;
        },
        handleEditClick,
        fetchUsers,
      }) as unknown as ColumnType<DefaultRecordType>[],
    [
      users,
      sortConfig,
      selectedRowKeys,
      onHeaderCellClick,
      onDeleteItem,
      handleRowSelect,
      handleSelectAll,
      fetchUser,
      handleEditClick,
      fetchUsers,
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
        fetchUsers={fetchUsers}
      />
      <ControlledTable
        variant="modern"
        data={users}
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
