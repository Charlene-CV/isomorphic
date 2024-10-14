'use client';

import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import PeopleTable from '@/app/shared/customers/people';
import CustomerNav from '@/app/shared/customers/customer-navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PeopleFormPage({ fetchCustomerPeople }: any) {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const uuidval = segments[2];
  const [uuid, setuuidval] = useState('');

  useEffect(() => {
    if (uuidval) {
      setuuidval(uuidval);
    }
  }, [uuidval]);

  const pageHeader = {
    title: 'People',
    breadcrumb: [
      {
        href: routes.editCustomer(uuid),
        name: 'Edit Customer',
      },
      {
        name: 'People',
      },
    ],
  };

  return (
    <>
      <PageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      ></PageHeader>
      <CustomerNav fetchCustomerPeople={fetchCustomerPeople} />
      <PeopleTable />
    </>
  );
}
