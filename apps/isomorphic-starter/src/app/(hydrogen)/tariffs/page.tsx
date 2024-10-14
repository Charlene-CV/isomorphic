'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import PageHeader from '@/app/shared/page-header';
// @ts-ignore
import Cookies from 'js-cookie';
import { routes } from '@/config/routes';
import TariffTable, { Tariffs } from '@/app/shared/tariffs';

const pageHeader = {
  title: 'Tariffs',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: routes.forms.tariffs,
      name: 'Tariffs',
    },
  ],
};

export default function TariffFormPage() {
  const [tariffs, setTariffs] = useState<Tariffs[]>([]);

  const fetchTariffs = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;

    try {
      const response = await axios.get<{ data: Tariffs[] }>(
        `${baseUrl}/api/v1/tariffs/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTariffs(response?.data?.data);
    } catch (error) {
      console.error('Error fetching tariffs:', error);
    }
  };

  useEffect(() => {
    fetchTariffs();
  }, []);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <TariffTable tariffs={tariffs} fetchTariffs={fetchTariffs} />
    </>
  );
}
