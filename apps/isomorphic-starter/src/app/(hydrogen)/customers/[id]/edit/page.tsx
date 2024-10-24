'use client';

import EditCustomer from '@/app/shared/customers/edit-customer';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import PageHeader from '@/app/shared/page-header';
// @ts-ignore
import Cookies from 'js-cookie';
import { Customer } from '@/app/shared/customers';
import { routes } from '@/config/routes';
import CustomerNav from '@/app/shared/customers/customer-navigation';

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
    {
      name: 'Edit',
    },
  ],
};

export default function EditCustomerPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [customer, setCustomer] = useState<Customer | null>(null);

  // Effect to fetch the customer when the router is ready
  const fetchCustomer = async () => {
    if (!id) return; // Exit if id is not available

    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;

    try {
      const response = await axios.get<{ data: Customer }>(
        `${baseUrl}/api/v1/customers/find-one/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomer(response?.data?.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]); // Add id as a dependency to the effect

  return (
    <>
      <PageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb ?? []}
      />
      <CustomerNav uuid={id} />
      {customer ? (
        <EditCustomer customerUuid={id as string} />
      ) : (
        <p>Loading...</p> // You can handle loading state here
      )}
    </>
  );
}
