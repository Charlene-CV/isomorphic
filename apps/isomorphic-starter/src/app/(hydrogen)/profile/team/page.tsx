'use client';
import ModalButton from '@/app/shared/modal-button';
import UsersTable, { User } from '@/app/shared/users/index';
import CreateRole from '@/app/shared/users/roles/create-role';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/config/url';
import PageHeader from '@/app/shared/page-header';
// @ts-ignore
import Cookies from 'js-cookie';
import RolesGrid from '@/app/shared/users/roles/role-grid';

// const pageHeader = {
//   title: 'Roles and Permissions ',
//   breadcrumb: [
//     {
//       href: '/',
//       name: 'Dashboard',
//     },
//     {
//       name: 'User Management, Role & Permission',
//     },
//   ],
// };

export default function BlankPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const fetchRoles = async (): Promise<void> => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      const response = await axios.get<{ data: any[] }>(
        `${baseUrl}/roles/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRoles(response.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const user: any = JSON.parse(Cookies.get('user'));
      const token = user.token;
      const response = await axios.get<{
        data: User[];
      }>(`${baseUrl}/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);
  return (
    <>
      <PageHeader title={'Users, Roles & Permissions'} breadcrumb={[]}>
        <ModalButton
          label="Add New Role"
          view={<CreateRole fetchRoles={fetchRoles} />}
          className="relative right-2 top-2 m-5 px-2 py-1 text-sm"
        />
      </PageHeader>
      <RolesGrid
        roles={roles}
        fetchRoles={fetchRoles}
        fetchUsers={fetchUsers}
      />
      <UsersTable users={users} fetchUsers={fetchUsers} />
    </>
  );
}
