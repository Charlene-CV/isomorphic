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
import { OrderFormInput } from "@/validators/create-order.schema";
import { useModal } from "../modal-views/use-modal";
import EditOrder from "./edit-order";
import { toast } from "react-hot-toast";
import { Button, Text } from "rizzui";
import { Controller, useForm } from "react-hook-form";
import FormGroup from "../form-group";
import { Checkbox } from "@nextui-org/checkbox";

const FilterElement = dynamic(
  () => import("@/app/shared/orders/filter-element"),
  { ssr: false }
);
const filterState = {
  name: "",
};

export default function OrdersTable({ orders, fetchOrders }: any) {
  const { control } = useForm();
  const [pageSize, setPageSize] = useState(10);
  const [editOrder, setEditOrder] = useState<OrderFormInput | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { openModal, closeModal } = useModal();
  const [filteredOrders, setFilteredOrders] = useState<OrderFormInput[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'name',
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
    const order = await fetchOrders(uuid);
    if (order) {
      setEditOrder(order);
      openModal({
        view: (
          <EditOrder
            orderData={order}
            fetchOrders={fetchOrders}
            closeModal={() => setIsModalOpen(false)}
          />
        ),
      });
    }
  };

  const handleDeleteOrder = async (uuids: string[]) => {
    try {
      const user: any = JSON.parse(Cookies.get("user"));
      const token = user.token;
      if (uuids.length > 0) {
        const response = await axios.delete(
          `${baseUrl}/api/v1/orders/delete`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            data: { uuids },
          }
        );

        if (response.status === 200) {
          fetchOrders();
          toast.success(<Text>Order deleted successfully!</Text>);
        } else {
          toast.error(<Text>Error deleting order...</Text>);
        }
      }
    } catch (error) {
      console.error("Error removing orders:", error);
    }
  };

  const handleSearching = async (param: string) => {
    setSearchTerm(param);
    const ordersPromise = fetchOrders();
    let savedOrders = await ordersPromise;
    ordersPromise.then((ordersArray: any) => {
      savedOrders = ordersArray;
    });
    let filtered = savedOrders.filter((order: { name: string }) =>
      order.name.includes(param)
    );
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    console.log("Search term changed:", searchTerm);
  }, [searchTerm]);
  const getOrder = async (uuid: string): Promise<OrderFormInput | null> => {
    try {
      const user: any = JSON.parse(Cookies.get("user"));
      const token = user.token;
      const response = await axios.get<{ data: OrderFormInput }>(
        `${baseUrl}/api/v1/orders/find-one/${uuid}`,
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
      console.error("Error fetching order:", error);
      return null;
    }
  };
  const fetchOrder = useCallback(
    async (uuid: string): Promise<OrderFormInput | null> => {
      return await getOrder(uuid);
    },
    []
  );

  const onDeleteItem = useCallback((uuid: string) => {
    handleDeleteOrder([uuid]);
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
  } = useTable(orders, pageSize, filterState);
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
        }
      ] as unknown as ColumnType<DefaultRecordType>[],
    [orders, sortConfig, selectedRowKeys, handleSort, onDeleteItem]
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
          fetchOrders={fetchOrders}
        />
        <Button onClick={() => setIsColumnModalOpen(true)} className="self-start w-auto mb-2 mt-2 bg-[#a5a234]">
          Select Columns
        </Button>
      </div>
      <ControlledTable
        variant="modern"
        data={filteredOrders.length > 0 ? filteredOrders : orders}
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
      {isModalOpen && editOrder && (
        <EditOrder
          orderData={editOrder}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
