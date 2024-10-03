'use client';

import { Badge, Text, Tooltip, ActionIcon } from 'rizzui';
import { HeaderCell } from '@/app/shared/table';
import DeletePopover from '@/app/shared/delete-popover';
import { ColumnType } from 'rc-table';
import AvatarCard from '@ui/avatar-card';
import { Customer } from '.';
import { routes } from '@/config/routes';
import PencilIcon from '@components/icons/pencil';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function getStatusBadge(status: boolean) {
  return status ? (
    <div className="flex items-center">
      <Badge color="success" renderAsDot />
      <Text className="ms-2 font-medium text-green-dark">Yes</Text>
    </div>
  ) : (
    <div className="flex items-center">
      <Badge color="danger" renderAsDot />
      <Text className="ms-2 font-medium text-red-dark">No</Text>
    </div>
  );
}

type Columns = {
  data: Customer[];
  sortConfig?: any;
  handleSelectAll: () => void;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  fetchCustomer?: (id: string) => Promise<Customer | null>;
  fetchCustomers?: () => Promise<Customer[] | null>;
};

type CustomerColumnType = ColumnType<Customer>;

export const getColumns = ({
  data,
  checkedItems,
  handleSelectAll,
  onDeleteItem,
  onHeaderCellClick,
  fetchCustomer,
  fetchCustomers,
  onChecked,
  sortConfig,
}: Columns): CustomerColumnType[] => {
  const router = useRouter();
  return [
    {
      title: <HeaderCell title="Name" />,
      dataIndex: 'fullName',
      key: 'fullName',
      width: 250,
      render: (_: string, customer: Customer) => {
        // Fallback to initials when avatar is not available
        const getInitials = (name: string) => {
          const names = name.split(' ');
          const initials = names
            .map((name) => name.charAt(0).toUpperCase())
            .join('');
          return initials;
        };

        const displayName = customer?.name;
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
          title="Short Code"
          sortable
          ascending={
            sortConfig?.direction === 'asc' && sortConfig?.key === 'role'
          }
        />
      ),
      dataIndex: 'shortCode',
      key: 'shortCode',
      width: 250,
      render: (shortCode) => {
        return shortCode;
      },
    },
    {
      title: <HeaderCell title="Active" />,
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      render: (value: boolean) => getStatusBadge(value),
    },
    {
      title: <HeaderCell title="Portal Access" />,
      dataIndex: 'hasPortalAccess',
      key: 'hasPortalAccess',
      width: 150,
      render: (value: boolean) => getStatusBadge(value),
    },
    {
      title: <HeaderCell title="Location sharing" />,
      dataIndex: 'liveLocation',
      key: 'liveLocation',
      width: 250,
      render: (liveLocation) => {
        return liveLocation;
      },
    },
    {
      title: <HeaderCell title="Actions" />,
      key: 'actions',
      width: 120,
      render: (_: any, row: Customer) => (
        <div className="flex gap-2">
          <Tooltip content="Edit" placement="top">
            <Link href={routes.editCustomer(row.uuid)} passHref>
              <ActionIcon
                as="span"
                size="sm"
                variant="outline"
                className="hover:!border-gray-900 hover:text-gray-700"
              >
                <PencilIcon className="h-4 w-4" />
              </ActionIcon>
            </Link>
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
