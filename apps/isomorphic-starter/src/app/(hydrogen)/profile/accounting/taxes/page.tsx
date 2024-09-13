"use client";

import ImportButton from '@/app/shared/import-button';
import PageHeader from '@/app/shared/page-header';
import EnhancedTanTable from '@/app/shared/tan-table/enhanced';
import { routes } from '@/config/routes';
// @ts-ignore
import Cookies from "js-cookie";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { TaxFormInput } from '@/validators/taxes-schema';

const pageHeader = {
  title: 'Tax Table',
  breadcrumb: [
    {
      href: routes.accounting,
      name: 'Accounting',
    },
    {
      name: 'Taxes',
    }
  ],
};

const columns = ["Name", "Origin", "Destination", "Tax", "Active"];

export default function TanTableEnhanced() {
  const [data, setData] = useState<TaxFormInput[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const user: any = JSON.parse(Cookies.get("user"));
        const token = user.token;
        const response = await axios.get(
          `http://192.168.0.146:8080/api/v1/taxes/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setData(response?.data?.data);
        console.log(response?.data?.data);
      } catch (error) {
        console.error('Error fetching taxes:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          {/* <ExportButton data={data} fileName={fileName} header={header} /> */}
          <ImportButton title={'Import File'} />
        </div>
      </PageHeader>

      {/* <EnhancedTanTable
        columns={columns}
        data={data}
        options={{}}
      /> */}
    </>
  );
}
