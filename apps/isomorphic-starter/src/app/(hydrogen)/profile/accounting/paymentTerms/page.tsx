'use client';

import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { useEffect, useState } from 'react';
import { TermFormInput } from '@/validators/create-terms.schema';
// @ts-ignore
import Cookies from 'js-cookie';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import ImportButton from '@/app/shared/import-button';
import TermGrid from '@/app/shared/payment-terms/terms-grid';
import ModalButton from '@/app/shared/modal-button';
import CreateTerms from '@/app/shared/payment-terms/create-tems';

const pageHeader = {
  title: 'All Terms',
  breadcrumb: [
    {
      href: routes.accounting,
      name: 'Accounting',
    },
    {
      name: 'Terms',
    },
  ],
};

export default function TanTableEnhanced() {
  const [data, setData] = useState<TermFormInput[]>([]);

  async function fetchData() {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;

    const response = await axios.get(`${baseUrl}/api/v1/payment-terms/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setData(response?.data?.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          {/* <ExportButton data={data} fileName={fileName} header={header} /> */}
          <ImportButton title={'Import File'} className="bg-[#a5a234]"/>
          <ModalButton
            label="Add New Term"
            view={<CreateTerms fetchTerms={fetchData} />}
            className="relative right-2 top-2 m-5 px-2 py-1 text-sm"
          />
        </div>
      </PageHeader>
      <TermGrid />
    </>
  );
}
