'use client';
import ModalButton from '@/app/shared/modal-button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import PageHeader from '@/app/shared/page-header';
// @ts-ignore
import Cookies from 'js-cookie';
import AccessorialTable from '@/app/shared/accessorials';
import CategoryGrid from '@/app/shared/accessorials/categories/category-grid';
import CreateCategory from '@/app/shared/accessorials/categories/create-category';

export default function BlankPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [accessorials, setAccessorials] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get(`${baseUrl}/api/v1/categories/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAccessorials = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;

      const response = await axios.get(`${baseUrl}/api/v1/accessorials/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccessorials(response.data.data);
    } catch (error) {
      console.error('Error fetching accessorials:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAccessorials();
  }, []);

  return (
    <>
      <PageHeader title={'Accessorials'} breadcrumb={[]}>
        <ModalButton
          label="Add New Category"
          view={<CreateCategory fetchCategories={fetchCategories} />}
          className="relative right-2 top-2 m-5 px-2 py-1 text-sm"
        />
      </PageHeader>
      <CategoryGrid
        categories={categories}
        fetchCategories={fetchCategories}
        fetchAccessorials={fetchAccessorials}
      />
      <AccessorialTable
        accessorials={accessorials}
        fetchAccessorials={fetchAccessorials}
      />
    </>
  );
}
