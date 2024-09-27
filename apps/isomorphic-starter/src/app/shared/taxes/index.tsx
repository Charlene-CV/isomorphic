'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@hooks/use-table';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import { ColumnType } from 'rc-table';
import ControlledTable from '../controlled-table';
import { DefaultRecordType } from 'rc-table/lib/interface';
// @ts-ignore
import Cookies from 'js-cookie';
import { TaxFormInput } from '@/validators/taxes-schema';
import { useModal } from '../modal-views/use-modal';
import EditTax from './edit-tax';

const FilterElement = dynamic(
  () => import('@/app/shared/taxes/filter-element'),
  { ssr: false }
);

const filterState = {
  name: '',
  origin: '',
  destination: '',
};

export default function TaxesTable({ taxes, fetchTaxes }: any) {
  const [pageSize, setPageSize] = useState(5);
  const [editTax, setEditTax] = useState<TaxFormInput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { openModal, closeModal } = useModal();
  const [filteredTaxes, setFilteredTaxes] = useState<TaxFormInput[]>([]);

  const handleEditClick = async (uuid: string) => {
    const tax = await fetchTax(uuid);
    if (tax) {
      setEditTax(tax);
      openModal({
        view: <EditTax taxData={tax} fetchTaxes={fetchTaxes} closeModal={() => setIsModalOpen(false)} />
      });
    }
  };

  const handleDeleteTax = async (uuids: string[]) => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      if (uuids.length > 0) {
        const response = await axios.delete(`${baseUrl}/api/v1/taxes/delete`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          data: { uuids },
        });

        if (response.status === 200) {
          fetchTaxes();
        }
      }
    } catch (error) {
      console.error('Error removing taxes:', error);
    }
  };

  const handleSearching = async (param: string) => {
    const taxesPromise = fetchTaxes();
    let savedTaxes = await taxesPromise;
    taxesPromise.then((taxesArray: any) => {
      savedTaxes = taxesArray;
    });
    let filtered = savedTaxes.filter((tax: { name: string }) => tax.name.includes(param));
    setFilteredTaxes(filtered);
  };

  const getTax = async (uuid: string): Promise<TaxFormInput | null> => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get<{ data: TaxFormInput }>(
        `${baseUrl}/api/v1/taxes/find-one/${uuid}`,
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
      console.error('Error fetching tax:', error);
      return null;
    }
  };

  const fetchTax = useCallback(async (uuid: string): Promise<TaxFormInput | null> => {
    return await getTax(uuid);
  }, []);

  const onDeleteItem = useCallback((uuid: string) => {
    handleDeleteTax([uuid]);
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
    sortConfig,
    handleSort,
    selectedRowKeys,
    handleRowSelect,
    handleSelectAll,
    handleReset,
  } = useTable(taxes, pageSize, filterState);

  const columns = useMemo(
    () =>
      [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          sorter: true,
          onHeaderCellClick: (value: string) => ({ onClick: () => handleSort(value) }),
        },
        {
          title: 'Origin',
          dataIndex: 'origin',
          key: 'origin',
        },
        {
          title: 'Destination',
          dataIndex: 'destination',
          key: 'destination',
        },
        {
          title: 'Tax',
          dataIndex: 'tax',
          key: 'tax',
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt',
          key: 'createdAt',
        },
        {
          title: 'Action',
          key: 'action',
          render: (text: string, record: TaxFormInput) => (
            <>
              <button className="mr-4" onClick={() => handleEditClick(record.uuid)}>Edit</button>
              <button onClick={() => onDeleteItem(record.uuid)}>Delete</button>
            </>
          ),
        },
      ] as ColumnType<DefaultRecordType>[],
    [taxes, sortConfig, selectedRowKeys, handleSort, onDeleteItem]
  );

  return (
    <div className="mt-14">
      <FilterElement
        isFiltered={isFiltered}
        filters={filters}
        updateFilter={updateFilter}
        handleReset={handleReset}
        onSearch={handleSearching}
        searchTerm={searchTerm}
        fetchTaxes={fetchTaxes}
      />
      <ControlledTable
        variant="modern"
        data={filteredTaxes.length > 0 ? filteredTaxes : taxes}
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
        className="rounded-md border border-muted text-sm shadow-sm"
      />
      {isModalOpen && editTax && (
        <EditTax
          taxData={editTax}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
