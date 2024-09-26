'use client';

import { PiDotsThreeBold } from 'react-icons/pi';
import { Title, ActionIcon, Dropdown } from 'rizzui';
import cn from '@utils/class-names';
import UserCog from '@components/icons/user-cog';
import ModalButton from '@/app/shared/modal-button';
import EditRole from '@/app/shared/users/roles/edit-role';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';

interface User {
  uuid: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface Role {
  uuid?: string;
  name: string;
  countUser: number;
  users: User[];
  permissions: Permission[];
}

interface Permission {
  uuid: string;
  write: boolean;
  edit: boolean;
  read: boolean;
  delete: boolean;
  functionList: Model;
}

interface Model {
  uuid: string;
  name: string;
}

export default function RoleCard({
  uuid,
  name,
  users,
  countUser,
  permissions,
  fetchRoles,
  fetchUsers,
}: any) {
  const handleRemoveRole = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    if (uuid) {
      const uuids: string[] = [uuid];

      try {
        const response = await axios.delete(`${baseUrl}/api/v1/roles/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { uuids },
        });

        if (response.status === 200) {
          fetchRoles();
        }
      } catch (error) {
        // Handle error here
        console.error('Error removing roles:', error);
      }
    }
  };

  return (
    <div className={cn('rounded-lg border border-muted p-6')}>
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className="grid h-7 w-7 place-content-center rounded-lg text-white"
            style={{
              backgroundColor: '#007bff', // You can customize this color or pass it as a prop
            }}
          >
            {/* Placeholder icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M7 6.5H16.75C18.8567 6.5 19.91 6.5 20.6667 7.00559C20.9943 7.22447 21.2755 7.50572 21.4944 7.83329C21.935 8.49268 21.9916 8.96506 21.9989 10.5M12 6.5L11.3666 5.23313C10.8418 4.18358 10.3622 3.12712 9.19926 2.69101C8.6899 2.5 8.10802 2.5 6.94427 2.5C5.1278 2.5 4.21956 2.5 3.53806 2.88032C3.05227 3.15142 2.65142 3.55227 2.38032 4.03806C2 4.71956 2 5.6278 2 7.44427V10.5C2 15.214 2 17.5711 3.46447 19.0355C4.8215 20.3926 6.44493 20.4927 10.5 20.5H11"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M15.59 18.9736C14.9612 19.3001 13.3126 19.9668 14.3167 20.801C14.8072 21.2085 15.3536 21.4999 16.0404 21.4999H19.9596C20.6464 21.4999 21.1928 21.2085 21.6833 20.801C22.6874 19.9668 21.0388 19.3001 20.41 18.9736C18.9355 18.208 17.0645 18.208 15.59 18.9736Z"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M20 14.4378C20 15.508 19.1046 16.3756 18 16.3756C16.8954 16.3756 16 15.508 16 14.4378C16 13.3676 16.8954 12.5 18 12.5C19.1046 12.5 20 13.3676 20 14.4378Z"
                stroke="currentColor"
                strokeWidth="1.3"
              />
            </svg>
          </span>
          <Title as="h4" className="font-medium">
            {name}
          </Title>
        </div>

        <Dropdown placement="bottom-end">
          <Dropdown.Trigger>
            <ActionIcon variant="text" className="ml-auto h-auto w-auto p-1">
              <PiDotsThreeBold className="h-auto w-6" />
            </ActionIcon>
          </Dropdown.Trigger>
          <Dropdown.Menu className="!z-0">
            <Dropdown.Item
              className="gap-2 text-xs sm:text-sm"
              onClick={handleRemoveRole}
            >
              Remove Role
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </header>

      <span className="ml-4">Total {countUser} users</span>
      <ModalButton
        customSize="700px"
        variant="outline"
        label="Edit Role"
        icon={<UserCog className="h-5 w-5" />}
        view={
          <div className="max-h-[450px] overflow-y-auto p-4">
            <EditRole
              roleUuid={uuid}
              fetchRoles={fetchRoles}
              fetchUsers={fetchUsers}
            />
          </div>
        }
        className="items-center gap-1 text-gray-800 @lg:w-full lg:mt-6"
      />
    </div>
  );
}
