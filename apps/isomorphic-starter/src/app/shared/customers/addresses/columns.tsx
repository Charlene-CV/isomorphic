'use client';

import { Badge, Text, Tooltip, ActionIcon } from 'rizzui';
import { HeaderCell } from '@/app/shared/table';
import EyeIcon from '@components/icons/eye';
import PencilIcon from '@components/icons/pencil';
import AvatarCard from '@ui/avatar-card';
import DeletePopover from '@/app/shared/delete-popover';
import { ColumnType } from 'rc-table';
import ModalButton from '@/app/shared/modal-button';
import { Addresses } from '.';
import EditAddress from './edit-addresses';

type Columns = {
  data: Addresses[];
  sortConfig?: any;
  handleSelectAll: () => void;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  handleEditClick: any;
  fetchAddress?: (id: string) => Promise<Addresses | null>;
  fetchAddresses?: any;
};

type AddressColumnType = ColumnType<Addresses>;

export const getColumns = ({
  data,
  sortConfig,
  onDeleteItem,
  onHeaderCellClick,
  handleEditClick,
  fetchAddress,
  fetchAddresses,
}: Columns): AddressColumnType[] => {
  return [
    {
      title: <HeaderCell title="Company Name" />,
      dataIndex: 'company',
      key: 'company',
      width: 250,
      render: (_: string, user: Addresses) => {
        // Fallback to initials when avatar is not available
        const getInitials = (name: string) => {
          const names = name.split(' ');
          const initials = names
            .map((name) => name.charAt(0).toUpperCase())
            .join('');
          return initials;
        };

        const displayName = `${user.company}`;
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
          title="Contact Name"
          sortable
          ascending={
            sortConfig?.direction === 'asc' && sortConfig?.key === 'role'
          }
        />
      ),
      dataIndex: 'contactName',
      key: 'contactName',
      width: 250,
      render: (contactName) => {
        return contactName;
      },
    },
    {
      title: (
        <HeaderCell
          title="Phone"
          sortable
          ascending={
            sortConfig?.direction === 'asc' && sortConfig?.key === 'role'
          }
        />
      ),
      dataIndex: 'phone',
      key: 'phone',
      width: 250,
      render: (phone) => {
        return phone;
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
      title: <HeaderCell title="External ID" />,
      dataIndex: 'externalId',
      key: 'externalId',
      width: 250,
      render: (externalId) => {
        return externalId;
      },
    },
    {
      title: <HeaderCell title="Actions" />,
      key: 'actions',
      width: 120,
      render: (_: any, row: Addresses) => (
        <div className="flex gap-2">
          <Tooltip content="View Details" placement="top">
            <ActionIcon
              onClick={async () => {
                if (fetchAddress) {
                  const user = await fetchAddress(row.uuid);
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
                view={
                  <EditAddress
                    uuid={row?.uuid}
                    address={row}
                    fetchAddresses={fetchAddresses}
                  />
                }
                customSize="600px"
                className="mt-0"
              />
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
