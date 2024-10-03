'use client';

import CustomerTable, { Customer } from '@/app/shared/customers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import PageHeader from '@/app/shared/page-header';
// @ts-ignore
import Cookies from 'js-cookie';
import { routes } from '@/config/routes';

const pageHeader = {
  title: 'Customers',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: routes.forms.customers,
      name: 'Customers',
    },
  ],
};

export default function CustomerFormPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const fetchCustomers = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    try {
      const response = await axios.get<{ data: Customer[] }>(
        `${baseUrl}/api/v1/customers/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCustomers(response?.data?.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <PageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      ></PageHeader>
      <CustomerTable customers={customers} fetchCustomers={fetchCustomers} />
    </>
  );
}
