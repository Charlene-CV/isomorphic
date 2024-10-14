'use client';

import ImportButton from "@/app/shared/import-button";
import PageHeader from "@/app/shared/page-header";
// @ts-ignore
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "@/config/url";
import OrdersTable from "@/app/shared/orders";
import { OrderFormInput } from "@/validators/create-order.schema";

const pageHeader = {
  title: "Orders",
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

export default function OrderTable() {
  const [data, setData] = useState<OrderFormInput[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
      console.log("entered fetchorders")
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      const response = await axios.get(`${baseUrl}/api/v1/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response?.data?.data || []);
      setLoading(false);
      return response?.data?.data;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
  }, [data]);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ImportButton title={"Import File"} className="bg-[#a5a234]"/>
        </div>
      </PageHeader>
      <OrdersTable orders={data} fetchOrders={fetchOrders} />
    </>
  );
}