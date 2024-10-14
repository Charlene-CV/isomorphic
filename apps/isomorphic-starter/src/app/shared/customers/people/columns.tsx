'use client';

import { Badge, Text, Tooltip, ActionIcon } from 'rizzui';
import { HeaderCell } from '@/app/shared/table';
import EyeIcon from '@components/icons/eye';
import PencilIcon from '@components/icons/pencil';
import AvatarCard from '@ui/avatar-card';
import DeletePopover from '@/app/shared/delete-popover';
import { ColumnType } from 'rc-table';
import ModalButton from '@/app/shared/modal-button';
import { People } from '.';
import EditPeople from './edit-people';

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
  data: People[];
  sortConfig?: any;
  handleSelectAll: () => void;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  handleEditClick: any;
  fetchPerson?: (id: string) => Promise<People | null>;
  fetchCustomerPeople?: any;
};

type PeopleColumnType = ColumnType<People>;

export const getColumns = ({
  data,
  sortConfig,
  onDeleteItem,
  onHeaderCellClick,
  handleEditClick,
  fetchPerson,
  fetchCustomerPeople,
}: Columns): PeopleColumnType[] => {
  return [
    {
      title: <HeaderCell title="Name" />,
      dataIndex: 'fullName',
      key: 'fullName',
      width: 250,
      render: (_: string, user: People) => {
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
      title: <HeaderCell title="Job" />,
      dataIndex: 'job',
      key: 'job',
      width: 250,
      render: (job) => {
        return job;
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
      title: <HeaderCell title="Status" />,
      dataIndex: 'status',
      key: 'status',
      width: 250,
      render: (status) => {
        return status;
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
      title: <HeaderCell title="Invoice" />,
      dataIndex: 'sendInvoices',
      key: 'sendInvoices',
      width: 150,
      render: (value: boolean) => getStatusBadge(value),
    },
    {
      title: <HeaderCell title="Reports" />,
      dataIndex: 'sendReports',
      key: 'sendReports',
      width: 150,
      render: (value: boolean) => getStatusBadge(value),
    },
    {
      title: <HeaderCell title="Portal" />,
      dataIndex: 'hasPortalAccess',
      key: 'hasPortalAccess',
      width: 150,
      render: (value: boolean) => getStatusBadge(value),
    },
    {
      title: <HeaderCell title="Actions" />,
      key: 'actions',
      width: 120,
      render: (_: any, row: People) => (
        <div className="flex gap-2">
          {/* <Tooltip content="View Details" placement="top">
            <ActionIcon
              onClick={async () => {
                if (fetchPerson) {
                  const user = await fetchPerson(row.uuid);
                  if (user) {
                    // Handle fetched user data, e.g., display in a modal
                  }
                }
              }}
            >
              <EyeIcon />
            </ActionIcon>
          </Tooltip> */}
          <Tooltip content="Edit" placement="top">
            <ActionIcon onClick={() => handleEditClick(row.uuid)}>
              <ModalButton
                label="Edit"
                view={
                  <EditPeople
                    uuid={row?.uuid}
                    people={row}
                    fetchCustomerPeople={fetchCustomerPeople}
                  />
                }
                customSize="600px"
                className="mt-0"
              />
              {/* <PencilIcon /> */}
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
