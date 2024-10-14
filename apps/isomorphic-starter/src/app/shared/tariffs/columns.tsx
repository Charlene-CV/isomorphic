'use client';

import { Badge, Text, Tooltip, ActionIcon } from 'rizzui';
import { HeaderCell } from '@/app/shared/table';
import AvatarCard from '@ui/avatar-card';
import DeletePopover from '@/app/shared/delete-popover';
import { ColumnType } from 'rc-table';
import { Tariffs } from '.';
import { routes } from '@/config/routes';
import PencilIcon from '@components/icons/pencil';
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
  data: Tariffs[];
  sortConfig?: any;
  handleSelectAll: () => void;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  fetchTariff?: (uuid: string) => Promise<Tariffs | null>;
  fetchTariffs?: any;
};

type TariffColumnType = ColumnType<Tariffs>;

export const getColumns = ({
  data,
  checkedItems,
  handleSelectAll,
  onDeleteItem,
  onHeaderCellClick,
  fetchTariff,
  fetchTariffs,
  onChecked,
  sortConfig,
}: Columns): TariffColumnType[] => {
  return [
    {
      title: <HeaderCell title="Name" />,
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (_: string, tariff: Tariffs) => {
        // Fallback to initials when avatar is not available
        const getInitials = (name: string) => {
          const names = name.split(' ');
          const initials = names
            .map((name) => name.charAt(0).toUpperCase())
            .join('');
          return initials;
        };

        const displayName = `${tariff.name}`;
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
      title: <HeaderCell title="Type" />,
      dataIndex: 'type',
      key: 'type',
      width: 250,
      render: (type) => {
        return type;
      },
    },
    {
      title: <HeaderCell title="Notes" />,
      dataIndex: 'notes',
      key: 'notes',
      width: 250,
      render: (notes) => {
        return notes;
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
      title: <HeaderCell title="Importing" />,
      dataIndex: 'isImporting',
      key: 'isImporting',
      width: 150,
      render: (value: boolean) => getStatusBadge(value),
    },
    {
      title: <HeaderCell title="Actions" />,
      key: 'actions',
      width: 120,
      render: (_: any, row: Tariffs) => (
        <div className="flex gap-2">
          <Tooltip content="Edit" placement="top">
            <Link href={routes.editTariff(row.uuid)} passHref>
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
