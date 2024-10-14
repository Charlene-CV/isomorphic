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
import { TaxFormInput } from '@/validators/taxes.schema';
import { useModal } from '../modal-views/use-modal';
import EditTax from './edit-tax';
import { Controller, useForm } from 'react-hook-form';
import FormGroup from '../form-group';
import { Checkbox } from '@nextui-org/checkbox';
import { Button } from 'rizzui';

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
  const { control } = useForm();
  const [pageSize, setPageSize] = useState(5);
  const [editTax, setEditTax] = useState<TaxFormInput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { openModal, closeModal } = useModal();
  const [filteredTaxes, setFilteredTaxes] = useState<TaxFormInput[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'name',
    'origin',
    'destination',
    'tax',
    'createdAt'
  ]);

  const toggleColumn = (columnKey: string) => {
    if (columnKey !== 'action') {
      setVisibleColumns((prevColumns) =>
        prevColumns.includes(columnKey)
          ? prevColumns.filter((col) => col !== columnKey)
          : [...prevColumns, columnKey]
      );
    }
  };

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
    setSearchTerm(param);
    const taxesPromise = fetchTaxes();
    let savedTaxes = await taxesPromise;
    taxesPromise.then((taxesArray: any) => {
      savedTaxes = taxesArray;
    });
    let filtered = savedTaxes.filter((tax: { name: string }) => tax.name.includes(param));
    setFilteredTaxes(filtered);
  };

  useEffect(() => {
    console.log('Search term changed:', searchTerm);
  }, [searchTerm]);

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
      {isColumnModalOpen && (
        <div className="bg-white p-6 rounded shadow-md w-1/3 z-60 relative">
          <form className="grid gap-6 p-6">
            <>
              <FormGroup title="Select Columns to Display">
                <div className="grid grid-cols-2 gap-4">
                  {columns
                    .filter((column) => column.key !== 'action')
                    .map((column) => (
                      <Controller
                        key={column.key}
                        name={`visibleColumns.${column.key}`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            isSelected={field.value}
                            onChange={() => toggleColumn(column.key as string)}
                            defaultSelected={visibleColumns.includes(column.key as string)}
                          >
                            <input
                              type="checkbox"
                              checked={visibleColumns.includes(column.key as string)}
                              onChange={() => toggleColumn(column.key as string)}
                              style={{
                                outline: '0.5px solid #d1d5db',
                                borderRadius: '0.25rem',
                                padding: '4px',
                                marginRight: '10px',
                                marginBottom: '4px',
                              }}
                            />
                            {column.title}
                          </Checkbox>
                        )}
                      />
                    ))}

                </div>
              </FormGroup>
            </>
          </form>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsColumnModalOpen(false)} className="w-full md:w-auto bg-[#a5a234]">
              Close
            </Button>
          </div>
        </div>
      )}

      <div className='flex flex-row justify-between'>
        <Button onClick={() => setIsColumnModalOpen(true)} className="self-start w-auto mb-2 mt-2 bg-[#a5a234]">
          Select Columns
        </Button>
        <FilterElement
          isFiltered={isFiltered}
          filters={filters}
          updateFilter={updateFilter}
          handleReset={handleReset}
          onSearch={handleSearching}
          searchTerm={searchTerm}
          fetchTaxes={fetchTaxes}
        />
      </div>
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
