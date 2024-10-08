'use client';

import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import AddressTable from '@/app/shared/customers/addresses';
import CustomerNav from '@/app/shared/customers/customer-navigation';

export default function AddressFormPage({ uuid, fetchAddresses }: any) {
  const pageHeader = {
    title: 'Addresses',
    breadcrumb: [
      {
        href: routes.editCustomer(uuid),
        name: 'Edit Customer',
      },
      {
        name: 'Addresses',
      },
    ],
  };

  return (
    <>
      <PageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      ></PageHeader>
      <CustomerNav fetchAddresses={fetchAddresses} />
      <AddressTable />
    </>
  );
}
