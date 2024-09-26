"use client";

import React from "react";
import TableToolbar from "@/app/shared/tan-table/table-toolbar";
import MainTable from "@/app/shared/table/main-table";
import TablePagination from "@/app/shared/table/table-pagination";
import { useTanStackTable } from "@/app/shared/tan-table/custom-table-components/use-TanStack-Table";

interface EnhancedTanTableProps {
  columns: any;
  data: any[];
  options?: any;
}

const EnhancedTanTable: React.FC<EnhancedTanTableProps> = ({
  columns,
  data,
  options,
}) => {
  const { table, setData } = useTanStackTable({
    tableData: data,
    columnConfig: columns,
    options: {
      ...options,
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 5,
        },
      },
      filterFns: {
        statusFilter: (
          row: { original: { [x: string]: string } },
          columnId: string | number,
          value: string
        ) => {
          if (!value) return false;
          let status =
            row.original[columnId].toLowerCase() === value.toLowerCase();
          return status;
        },
        priceFilter: (row: any, columnId: any, value: any) => {
          if (!value) return false;
          return true;
        },
        createdDate: (row: any, columnId: any, value: any) => {
          if (!value) return false;
          return true;
        },
        dueDate: (row: any, columnId: any, value: any) => {
          if (!value) return false;
          return true;
        },
      },
      meta: {
        handleDeleteRow: (row: { id: string }) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        },
        handleMultipleDelete: (rows: string | string[]) => {
          setData((prev) => prev.filter((r) => !rows.includes(r.id)));
          table.resetRowSelection();
        },
      },
      enableColumnResizing: false,
    },
  });

  return (
    <>
      <TableToolbar table={table} />
      <MainTable table={table} variant={"modern"} />
      <TablePagination table={table} />
    </>
  );
};

export default EnhancedTanTable;

// import React from 'react';
// import { defaultColumns } from './column';
// import TableToolbar from '@/app/shared/tan-table/table-toolbar';
// import MainTable from '@/app/shared/table/main-table';
// import WidgetCard from '@components/cards/widget-card';
// import { Person, defaultData } from '@/data/tan-table-data';
// import TablePagination from '@/app/shared/table/table-pagination';
// import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

// export default function EnhancedTanTable() {
//   const { table, setData } = useTanStackTable<Person>({
//     tableData: defaultData,
//     columnConfig: defaultColumns,
//     options: {
//       initialState: {
//         pagination: {
//           pageIndex: 0,
//           pageSize: 5,
//         },
//       },
//       filterFns: {
//         statusFilter: (row: { original: { [x: string]: string; }; }, columnId: string | number, value: string) => {
//           if (!value) return false;
//           let status =
//             row.original[columnId].toLowerCase() === value.toLowerCase()
//               ? true
//               : false;
//           return status;
//         },
//         priceFilter: (row: any, columnId: any, value: any) => {
//           if (!value) return false;
//           return true;
//         },
//         createdDate: (row: any, columnId: any, value: any) => {
//           if (!value) return false;
//           return true;
//         },
//         dueDate: (row: any, columnId: any, value: any) => {
//           if (!value) return false;
//           return true;
//         },
//       },
//       meta: {
//         handleDeleteRow: (row: { id: string; }) => {
//           setData((prev) => prev.filter((r) => r.id !== row.id));
//         },
//         handleMultipleDelete: (rows: string | string[]) => {
//           setData((prev) => prev.filter((r) => !rows.includes(r.id)));
//           table.resetRowSelection();
//         },
//       },
//       enableColumnResizing: false,
//     },
//   });

//   // function handleDragEnd(event: DragEndEvent) {
//   //   const isRow = dataIds.includes(event.active.id);
//   //   if (isRow) {
//   //     handleDragEndRow(event);
//   //   } else {
//   //     handleDragEndColumn(event);
//   //   }
//   // }

//   return (
//     <>
//         <TableToolbar table={table} />
//         <MainTable table={table} variant={'modern'} />
//         <TablePagination table={table} />
//     </>
//   );
// }
