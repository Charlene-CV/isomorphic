'use client';

import ImportButton from "@/app/shared/import-button";
import PageHeader from "@/app/shared/page-header";
import { routes } from "@/config/routes";
// @ts-ignore
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "@/config/url";
import EquipmentTable from "@/app/shared/equipment";
import { EquipFormInput } from "@/validators/equipment.schema";
import DeletePopover from "@/app/shared/delete-popover";

const pageHeader = {
  title: "Equipment Table",
  breadcrumb: [
    {
      href: routes.management,
      name: "Management",
    },
    {
      name: "Equipment",
    },
  ],
};

export default function EquipTable() {
  const [data, setData] = useState<EquipFormInput[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEquipments = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      const response = await axios.get(`${baseUrl}/api/v1/equipments/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("FETCHED: ", response?.data?.data)
      setData(response?.data?.data || []);
      return response?.data?.data;
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  useEffect(() => {
  }, [data]);


  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <ImportButton title={"Import File"} className="bg-[#a5a234]" />
        </div>
      </PageHeader>
      <div className="flex flex-row justify-end">
      </div>
      <EquipmentTable equipment={data} fetchEquipments={fetchEquipments} />
    </>
  );
}
