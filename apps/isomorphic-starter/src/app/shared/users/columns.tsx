'use client';

import { Badge, Text, Tooltip, ActionIcon } from 'rizzui';
import { HeaderCell } from '@/app/shared/table';
import EyeIcon from '@components/icons/eye';
import PencilIcon from '@components/icons/pencil';
import AvatarCard from '@ui/avatar-card';
import moment from 'moment';
import DeletePopover from '@/app/shared/delete-popover';
import { Role, User } from './index';
import { ColumnType } from 'rc-table';
import EditUser from './edit-user';
import ModalButton from '@/app/shared/modal-button';

function getStatusBadge(status: boolean) {
  return status ? (
    <div className="flex items-center">
      <Badge color="success" renderAsDot />
      <Text className="ms-2 font-medium text-green-dark">Active</Text>
    </div>
  ) : (
    <div className="flex items-center">
      <Badge color="danger" renderAsDot />
      <Text className="ms-2 font-medium text-red-dark">Deactivated</Text>
    </div>
  );
}

type Columns = {
  data: User[];
  sortConfig?: any;
  handleSelectAll: () => void;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  fetchUser?: (id: string) => Promise<User | null>;
  handleEditClick: any;
  fetchUsers: any;
};

type UserColumnType = ColumnType<User>;

export const getColumns = ({
  data,
  sortConfig,
  onDeleteItem,
  onHeaderCellClick,
  fetchUser,
  handleEditClick,
  fetchUsers,
}: Columns): UserColumnType[] => {
  return [
    {
      title: <HeaderCell title="Name" />,
      dataIndex: 'fullName',
      key: 'fullName',
      width: 250,
      render: (_: string, user: User) => {
        // Fallback to initials when avatar is not available
        const getInitials = (name: string) => {
          const names = name.split(' ');
          const initials = names
            .map((name) => name.charAt(0).toUpperCase())
            .join('');
          return initials;
        };

        const displayName = `${user.firstName ?? ''} ${user.lastName ?? ''}`;
        const avatarContent = getInitials(displayName);

        return (
          <AvatarCard
            src={avatarContent} // Display initials if no avatar
            name={displayName}
          />
        );
      },
    },
    {
      title: (
        <HeaderCell
          title="Email"
          sortable
          ascending={
            sortConfig?.direction === 'asc' && sortConfig?.key === 'role'
          }
        />
      ),
      dataIndex: 'email',
      key: 'email',
      width: 250,
      render: (email) => {
        return email;
      },
    },
    {
      title: (
        <HeaderCell
          title="Role"
          sortable
          ascending={
            sortConfig?.direction === 'asc' && sortConfig?.key === 'role'
          }
        />
      ),
      onHeaderCell: (): any => onHeaderCellClick('role'),
      dataIndex: 'role',
      key: 'role',
      width: 250,
      render: (role: Role) => role.name,
    },
    {
      title: (
        <HeaderCell
          title="Created"
          sortable
          ascending={
            sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'
          }
        />
      ),
      onHeaderCell: (): any => onHeaderCellClick('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (createdAt: string) => {
        return moment(createdAt).format('MMMM D YYYY h:mm');
      },
    },
    {
      title: <HeaderCell title="Status" />,
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      render: (value: boolean) => getStatusBadge(value),
    },
    {
      title: <HeaderCell title="Actions" />,
      key: 'actions',
      width: 120,
      render: (_: any, row: User) => (
        <div className="flex gap-2">
          <Tooltip content="View Details" placement="top">
            <ActionIcon
              onClick={async () => {
                if (fetchUser) {
                  const user = await fetchUser(row.uuid);
                  if (user) {
                    // Handle fetched user data, e.g., display in a modal
                  }
                }
              }}
            >
              <EyeIcon />
            </ActionIcon>
          </Tooltip>
          <Tooltip content="Edit" placement="top">
            <ActionIcon onClick={() => handleEditClick(row.uuid)}>
              <ModalButton
                label="Edit"
                view={<EditUser user={row} fetchUsers={fetchUsers} />}
                customSize="600px"
                className="mt-0"
              />
              <PencilIcon />
            </ActionIcon>
          </Tooltip>
          <DeletePopover
            onDelete={() => onDeleteItem(row.uuid)}
            title={'Delete'}
            description={''}
          />
        </div>
      ),
    },
  ];
};
