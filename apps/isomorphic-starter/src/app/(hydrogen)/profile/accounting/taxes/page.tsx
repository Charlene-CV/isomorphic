'use client';

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
import TaxesTable from "@/app/shared/taxes";

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

export default function TaxTable() {
  const [data, setData] = useState<TaxFormInput[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTaxes = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      const response = await axios.get(`${baseUrl}/api/v1/taxes/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response?.data?.data || []);
      return response?.data?.data;
    } catch (error) {
      console.error('Error fetching taxes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ImportButton title={"Import File"} className="bg-[#a5a234]"/>
        </div>
      </PageHeader>
      <TaxesTable taxes={data} fetchTaxes={fetchTaxes} />
    </>
  );
}
