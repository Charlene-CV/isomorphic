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
import { EquipFormInput } from '@/validators/equipment.schema';
import { useModal } from '../modal-views/use-modal';
import EditEquip from './edit-equip';
import FormGroup from '../form-group';
import { Button } from 'rizzui';
import { useForm, Controller } from 'react-hook-form';
import { Checkbox } from '@nextui-org/checkbox';

const FilterElement = dynamic(
  () => import('@/app/shared/equipment/filter-element'),
  { ssr: false }
);

const filterState = {
  name: '',
  status: '',
  description: null,
  externalId: null,
  isBillable: false,
  isIftaTracking: false,
  vin: null,
  payAmount: null,
  specifications: {
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    capacity: 0,
    units: '',
  },
  licenses: [],
  managerUuid: null,
  driverUuid: null,
  typeUuid: '',
  subTypeUuid: null,
  paymentTypeUuid: null,
};

export default function EquipmentTable({ equipment, fetchEquipments }: any) {
  const { control } = useForm();
  const [pageSize, setPageSize] = useState(5);
  const [editEquip, setEditEquip] = useState<EquipFormInput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { openModal, closeModal } = useModal();
  const [filteredEquips, setFilteredEquips] = useState<EquipFormInput[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'name',
    'status',
    'type',
    'subtype',
    'description',
    'manager',
    'driver',
    'isBillable',
  ]);

  const handleEditClick = async (uuid: string) => {
    const equip = await fetchEquipment(uuid);
    if (equip) {
      setEditEquip(equip);
      openModal({
        view: <EditEquip equipData={equip} fetchEquipments={fetchEquipments} closeModal={() => setIsModalOpen(false)} />
      });
    }
  };

  const handleDeleteEquip = async (uuids: string[]) => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      if (uuids.length > 0) {
        const response = await axios.delete(`${baseUrl}/api/v1/equipments/delete`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          data: { uuids },
        });

        if (response.status === 200) {
          fetchEquipments();
        }
      }
    } catch (error) {
      console.error('Error removing equipment:', error);
    }
  };

  const handleSearching = async (param: string) => {
    setSearchTerm(param);
    const equipPromise = fetchEquipments();
    let savedEquips = await equipPromise;
    equipPromise.then((equipArray: any) => {
      savedEquips = equipArray;
    });
    let filtered = savedEquips.filter((equipment: { name: string }) => equipment.name.includes(param));
    setFilteredEquips(filtered);
  };

  useEffect(() => {
    console.log('Search term changed:', searchTerm);
    console.log({ equipment });
  }, [searchTerm]);

  const getEquip = async (uuid: string): Promise<EquipFormInput | null> => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get<{ data: EquipFormInput }>(
        `${baseUrl}/api/v1/equipments/find-one/${uuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response.status === 200) {
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
      return null;
    }
  };

  const fetchEquipment = useCallback(async (uuid: string): Promise<EquipFormInput | null> => {
    return await getEquip(uuid);
  }, []);

  const onDeleteItem = useCallback((uuid: string) => {
    handleDeleteEquip([uuid]);
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
  } = useTable(equipment, pageSize, filterState);

  const toggleColumn = (columnKey: string) => {
    if (columnKey !== 'action') {
      setVisibleColumns((prevColumns) =>
        prevColumns.includes(columnKey)
          ? prevColumns.filter((col) => col !== columnKey)
          : [...prevColumns, columnKey]
      );
    }
  };

  const columns = useMemo(
    () =>
      [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          sorter: true,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          render: (type: { name: string }) => type ? type.name : 'N/A',
        },
        {
          title: 'Subtype',
          dataIndex: 'subtype',
          key: 'subtype',
          render: (subtype: { name: string }) => subtype ? subtype.name : 'N/A',
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'Manager',
          dataIndex: ['manager', 'name'],
          key: 'manager',
          render: (manager: { name: string }) => manager ? manager.name : 'N/A',
        },
        {
          title: 'Driver',
          dataIndex: ['driver', 'name'],
          key: 'driver',
          render: (driver: { name: string }) => driver ? driver.name : 'N/A',
        },
        {
          title: 'Billable',
          dataIndex: 'isBillable',
          key: 'isBillable',
          render: (isBillable: boolean) => (isBillable ? 'Yes' : 'No'),
        },
        {
          title: 'Action',
          key: 'action',
          render: (text: string, record: EquipFormInput) => (
            <>
              <button className="mr-4" onClick={() => handleEditClick(record.uuid)}>Edit</button>
              <button onClick={() => onDeleteItem(record.uuid)}>Delete</button>
            </>
          ),
        },
      ] as ColumnType<DefaultRecordType>[],
    [equipment, sortConfig, selectedRowKeys, handleSort, onDeleteItem]
  );

  const filteredColumns = columns.filter(
    (column) => visibleColumns.includes(column.key as string) || column.key === 'action'
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
        <FilterElement
          isFiltered={isFiltered}
          filters={filters}
          updateFilter={updateFilter}
          handleReset={handleReset}
          onSearch={handleSearching}
          searchTerm={searchTerm}
          fetchEquipments={fetchEquipments}
        />
        <Button onClick={() => setIsColumnModalOpen(true)} className="self-start w-auto mb-2 mt-2 bg-[#a5a234]">
          Select Columns
        </Button>
      </div>
      <ControlledTable
        variant="modern"
        data={filteredEquips.length > 0 ? filteredEquips : equipment}
        isLoading={isLoading}
        showLoadingText={true}
        columns={filteredColumns}
        paginatorOptions={{
          pageSize,
          setPageSize,
          total: totalItems,
          current: currentPage,
          onChange: (page: number) => handlePaginate(page),
        }}
        className="rounded-md border border-muted text-sm shadow-sm"
      />
      {isModalOpen && editEquip && (
        <EditEquip
          equipData={editEquip}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
