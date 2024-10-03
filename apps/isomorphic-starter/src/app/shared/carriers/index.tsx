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
      <FilterElement
        isFiltered={isFiltered}
        filters={filters}
        updateFilter={updateFilter}
        handleReset={handleReset}
        onSearch={handleSearching}
        searchTerm={searchTerm}
        fetchCarriers={fetchCarriers}
      />
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
