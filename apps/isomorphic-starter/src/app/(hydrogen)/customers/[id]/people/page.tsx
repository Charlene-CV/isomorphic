'use client';

import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import PeopleTable from '@/app/shared/customers/people';
import CustomerNav from '@/app/shared/customers/customer-navigation';

export default function PeopleFormPage({ uuid, fetchCustomerPeople }: any) {
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
