'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import PageHeader from '@/app/shared/page-header';
// @ts-ignore
import Cookies from 'js-cookie';
import { routes } from '@/config/routes';
import { Tariffs } from '@/app/shared/tariffs';
import EditTariff from '@/app/shared/tariffs/edit-tariff';

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
    {
      name: 'Edit',
    },
  ],
};

export default function EditTariffPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [tariff, setTariff] = useState<Tariffs | null>(null);

  const fetchTariff = async () => {
    if (!id) return;

    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;

    try {
      const response = await axios.get<{ data: Tariffs }>(
        `${baseUrl}/api/v1/tariffs/find-one/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTariff(response?.data?.data);
    } catch (error) {
      console.error('Error fetching tariff:', error);
    }
  };

  useEffect(() => {
    fetchTariff();
  }, [id]);

  return (
    <>
      <PageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb ?? []}
      />
      {tariff ? <EditTariff tariffUuid={id as string} /> : <p>Loading...</p>}
    </>
  );
}
