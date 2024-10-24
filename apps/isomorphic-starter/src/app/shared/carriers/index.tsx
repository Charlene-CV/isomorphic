"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTable } from "@hooks/use-table";
import axios from "axios";
import { baseUrl } from "@/config/url";
import { ColumnType } from "rc-table";
import ControlledTable from "../controlled-table";
import { DefaultRecordType } from "rc-table/lib/interface";
// @ts-ignore
import Cookies from "js-cookie";
import { CarrierFormInput } from "@/validators/carrier-schema";
import { useModal } from "../modal-views/use-modal";
import EditCarrier from "./edit-carrier";
import { toast } from "react-hot-toast";
import { Button, Text } from "rizzui";
import FormGroup from "../form-group";
import { useForm, Controller } from 'react-hook-form';
import { Checkbox } from '@nextui-org/checkbox';

const FilterElement = dynamic(
  () => import("@/app/shared/carriers/filter-element"),
  { ssr: false }
);
const filterState = {
  name: "",
  dotId: null,
  currency: "",
  addresses: [
    {
      address: null,
      city: null,
      state: null,
      postal: null,
      country: null,
      latitude: 0,
      longitude: 0,
    },
  ],
};

export default function CarriersTable({ carriers, fetchCarriers }: any) {
  const [pageSize, setPageSize] = useState(10);
  const [editCarrier, setEditCarrier] = useState<CarrierFormInput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { openModal, closeModal } = useModal();
  const [filteredCarriers, setFilteredCarriers] = useState<CarrierFormInput[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const { control } = useForm();
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'name',
    'dotId',
    'currency',
    'addresses',
    'latitude',
    'longitude'
  ]);

  const handleEditClick = async (uuid: string) => {
    const carrier = await fetchCarrier(uuid);
    if (carrier) {
      setEditCarrier(carrier);
      openModal({
        view: (
          <EditCarrier
            carrierData={carrier}
            fetchCarriers={fetchCarriers}
            closeModal={() => setIsModalOpen(false)}
          />
        ),
      });
    }
  };

  const handleDeleteCarrier = async (uuids: string[]) => {
    try {
      const user: any = JSON.parse(Cookies.get("user"));
      const token = user.token;
      if (uuids.length > 0) {
        const response = await axios.delete(
          `${baseUrl}/api/v1/carriers/delete`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            data: { uuids },
          }
        );

        if (response.status === 200) {
          fetchCarriers();
          toast.success(<Text>Carrier deleted successfully!</Text>);
        } else {
          toast.error(<Text>Error deleting carrier...</Text>);
        }
      }
    } catch (error) {
      console.error("Error removing carriers:", error);
    }
  };

  const handleSearching = async (param: string) => {
    setSearchTerm(param);
    const carriersPromise = fetchCarriers();
    let savedCarriers = await carriersPromise;
    carriersPromise.then((carriersArray: any) => {
      savedCarriers = carriersArray;
    });
    let filtered = savedCarriers.filter((carrier: { name: string }) =>
      carrier.name.includes(param)
    );
    setFilteredCarriers(filtered);
  };

  useEffect(() => {
    console.log("Search term changed:", searchTerm);
  }, [searchTerm]);
  const getCarrier = async (uuid: string): Promise<CarrierFormInput | null> => {
    try {
      const user: any = JSON.parse(Cookies.get("user"));
      const token = user.token;
      const response = await axios.get<{ data: CarrierFormInput }>(
        `${baseUrl}/api/v1/carriers/find-one/${uuid}`,
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
      console.error("Error fetching carrier:", error);
      return null;
    }
  };
  const fetchCarrier = useCallback(
    async (uuid: string): Promise<CarrierFormInput | null> => {
      return await getCarrier(uuid);
    },
    []
  );

  const onDeleteItem = useCallback((uuid: string) => {
    handleDeleteCarrier([uuid]);
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
  } = useTable(carriers, pageSize, filterState);

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
          title: "Name",
          dataIndex: "name",
          key: "name",
          sorter: true,
          onHeaderCellClick: (value: string) => ({
            onClick: () => handleSort(value),
          }),
        },
        {
          title: "DOT ID",
          dataIndex: "dotId",
          key: "dotId",
        },
        {
          title: "Currency",
          dataIndex: "currency",
          key: "currency",
        },
        {
          title: "Address",
          dataIndex: "addresses",
          key: "address",
          render: (addresses: any[]) =>
            addresses.map((address, index) => (
              <div key={index}>
                {address.address}, {address.city}, {address.state}, {address.postal}, {address.country}
              </div>
            )),
        },
        {
          title: "Latitude",
          dataIndex: "addresses",
          key: "latitude",
          render: (addresses: any[]) =>
            addresses.map((address, index) => (
              <div key={index}>{address.latitude}</div>
            )),
        },
        {
          title: "Longitude",
          dataIndex: "addresses",
          key: "longitude",
          render: (addresses: any[]) =>
            addresses.map((address, index) => (
              <div key={index}>{address.longitude}</div>
            )),
        },
        {
          title: "Action",
          key: "action",
          render: (text: string, record: CarrierFormInput) => (
            <>
              <button
                className="mr-4"
                onClick={() => handleEditClick(record.uuid)}
              >
                Edit
              </button>
              <button onClick={() => onDeleteItem(record.uuid)}>Delete</button>
            </>
          ),
        },
      ] as ColumnType<DefaultRecordType>[],
    [carriers, sortConfig, selectedRowKeys, handleSort, onDeleteItem]
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
          fetchCarriers={fetchCarriers}
        />
        <Button onClick={() => setIsColumnModalOpen(true)} className="self-start w-auto mb-2 mt-2 bg-[#a5a234]">
          Select Columns
        </Button>
      </div>
      <ControlledTable
        variant="modern"
        data={filteredCarriers.length > 0 ? filteredCarriers : carriers}
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
      {isModalOpen && editCarrier && (
        <EditCarrier
          carrierData={editCarrier}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
