'use client';

import ImportButton from "@/app/shared/import-button";
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";
// @ts-ignore
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "@/config/url";
import CarriersTable from "@/app/shared/carriers";
import { CarrierFormInput } from "@/validators/carrier-schema";

const pageHeader = {
  title: "Carriers Table",
  breadcrumb: [
    // {
    //   href: routes.management,
    //   name: "Management",
    // },
    // {
    //   name: "Equipment",
    // },
  ],
};

export default function CarrierTable() {
  const [data, setData] = useState<CarrierFormInput[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCarriers = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      const response = await axios.get(`${baseUrl}/api/v1/carriers/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response?.data?.data || []);
      return response?.data?.data;
    } catch (error) {
      console.error('Error fetching carriers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarriers();
  }, []);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ImportButton title={"Import File"} />
        </div>
      </PageHeader>
      <CarriersTable carriers={data} fetchCarriers={fetchCarriers} />
    </>
  );
}