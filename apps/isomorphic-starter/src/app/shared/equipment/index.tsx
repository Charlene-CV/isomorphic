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
import { EquipFormInput } from '@/validators/equipment-schema';
import { useModal } from '../modal-views/use-modal';
import EditEquip from './edit-equip';

const FilterElement = dynamic(
  () => import('@/app/shared/equipment/filter-element'),
  { ssr: false }
);

const filterState = {
  name: '',
  origin: '',
  destination: '',
};

export default function EquipmentTable({ equipment, fetchEquipments }: any) {
  const [pageSize, setPageSize] = useState(5);
  const [editEquip, setEditEquip] = useState<EquipFormInput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { openModal, closeModal } = useModal();
  const [filteredEquips, setFilteredEquips] = useState<EquipFormInput[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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
        const response = await axios.delete(`${baseUrl}/api/v1/equipment/delete`, {
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
  }, [searchTerm]);

  const getEquip = async (uuid: string): Promise<EquipFormInput | null> => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get<{ data: EquipFormInput }>(
        `${baseUrl}/api/v1/equipment/find-one/${uuid}`,
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
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'External ID',
          dataIndex: 'externalId',
          key: 'externalId',
        },
        {
          title: 'Billable',
          dataIndex: 'isBillable',
          key: 'isBillable',
          render: (isBillable: boolean) => (isBillable ? 'Yes' : 'No'),
        },
        {
          title: 'IFTA Tracking',
          dataIndex: 'isIftaTracking',
          key: 'isIftaTracking',
          render: (isIftaTracking: boolean) => (isIftaTracking ? 'Yes' : 'No'),
        },
        {
          title: 'VIN',
          dataIndex: 'vin',
          key: 'vin',
        },
        {
          title: 'Pay Amount',
          dataIndex: 'payAmount',
          key: 'payAmount',
          render: (payAmount: number | null) => (payAmount !== null ? `$${payAmount.toFixed(2)}` : 'N/A'),
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

  return (
    <div className="mt-14">
      <FilterElement
        isFiltered={isFiltered}
        filters={filters}
        updateFilter={updateFilter}
        handleReset={handleReset}
        onSearch={handleSearching}
        searchTerm={searchTerm}
        fetchEquipments={fetchEquipments}
      />
      <ControlledTable
        variant="modern"
        data={filteredEquips.length > 0 ? filteredEquips : equipment}
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
      {isModalOpen && editEquip && (
        <EditEquip
          equipData={editEquip}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
