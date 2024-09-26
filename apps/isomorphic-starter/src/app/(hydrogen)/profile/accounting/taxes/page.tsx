"use client";

import ImportButton from "@/app/shared/import-button";
import PageHeader from "@/app/shared/page-header";
import EnhancedTanTable from "@/app/shared/tan-table/enhanced";
import { routes } from "@/config/routes";
// @ts-ignore
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { TaxFormInput } from "@/validators/taxes-schema";
import { baseUrl } from "@/config/url";

const pageHeader = {
  title: "Tax Table",
  breadcrumb: [
    {
      href: routes.accounting,
      name: "Accounting",
    },
    {
      name: "Taxes",
    },
  ],
};

const columns = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    cell: (info: { getValue: () => string }) => {
      const value = info.getValue();
      console.log('Name column value:', value);
      return value;
    },
  },
  {
    id: 'origin',
    header: 'Origin',
    accessor: 'origin',
    cell: (info: { getValue: () => string }) => {
      const value = info.getValue();
      console.log('Origin column value:', value);
      return value;
    },
  },
  {
    id: 'destination',
    header: 'Destination',
    accessor: 'destination',
    cell: (info: { getValue: () => string }) => {
      const value = info.getValue();
      console.log('Destination column value:', value);
      return value;
    },
  },
  {
    id: 'tax',
    header: 'Tax',
    accessor: 'tax',
    cell: (info: { getValue: () => number }) => {
      const value = info.getValue();
      console.log('Tax column value:', value);
      return value;
    },
  },
  {
    id: 'createdAt',
    header: 'Created At',
    accessor: 'createdAt',
    cell: (info: { getValue: () => string }) => {
      const value = info.getValue();
      console.log('CreatedAt column value:', value);
      const date = new Date(value);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    },
  }
];

export default function TanTableEnhanced() {
  const [data, setData] = useState<TaxFormInput[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const user: any = JSON.parse(Cookies.get('user'));
        const token = user.token;
        const response = await axios.get(`${baseUrl}/api/v1/taxes/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response: ", response.data);
        setData(response?.data?.data || []);  // Ensure data is set or fallback to empty array
      } catch (error) {
        console.error('Error fetching taxes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  console.log("Fetched Data: ", data);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ImportButton title={"Import File"} />
        </div>
      </PageHeader>
      
      {loading ? (
        <div>Loading...</div> // Optionally add a loading state
      ) : (
        data.length > 0 ? (
          <EnhancedTanTable columns={columns} data={data} />  // Render table only when data is available
        ) : (
          <div>No data available</div>  // Message for no data
        )
      )}
    </>
  );
}
