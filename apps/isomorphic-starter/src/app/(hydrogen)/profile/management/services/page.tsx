'use client';
import ModalButton from '@/app/shared/modal-button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import PageHeader from '@/app/shared/page-header';
// @ts-ignore
import Cookies from 'js-cookie';
import ServiceTable from '@/app/shared/services';
import TypeGrid from '@/app/shared/services/types/type-grid';
import CreateType from '@/app/shared/services/types/create-type';

export default function BlankPage() {
  const [types, setTypes] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const fetchTypes = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get(`${baseUrl}/api/v1/service-types/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTypes(response.data.data);
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get(`${baseUrl}/api/v1/services/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchTypes();
    fetchServices();
  }, []);

  return (
    <>
      <PageHeader title={'Services'} breadcrumb={[]}>
        <ModalButton
          label="Add New Type"
          view={<CreateType fetchTypes={fetchTypes} />}
          className="relative right-2 top-2 m-5 px-2 py-1 text-sm"
        />
      </PageHeader>
      <TypeGrid
        types={types}
        fetchServices={fetchServices}
        fetchTypes={fetchTypes}
      />
      <ServiceTable services={services} fetchServices={fetchServices} />
    </>
  );
}
