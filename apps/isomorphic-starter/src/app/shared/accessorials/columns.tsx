'use client';

import { Badge, Text, Tooltip, ActionIcon } from 'rizzui';
import { HeaderCell } from '@/app/shared/table';
// import EyeIcon from '@components/icons/eye';
// import PencilIcon from '@components/icons/pencil';
// import AvatarCard from '@ui/avatar-card';
// import moment from 'moment';
import DeletePopover from '@/app/shared/delete-popover';
import { ColumnType } from 'rc-table';
import ModalButton from '@/app/shared/modal-button';
import EditAccessorial from './edit-accessorial';
import { Category, Accessorial } from '.';

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
  data: Accessorial[];
  sortConfig?: any;
  handleSelectAll: () => void;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  handleEditClick: any;
  fetchAccessorial?: (id: string) => Promise<Accessorial | null>;
  fetchAccessorials?: () => Promise<Accessorial[] | null>;
};

type AccessorialColumnType = ColumnType<Accessorial>;

export const getColumns = ({
  data,
  checkedItems,
  handleEditClick,
  handleSelectAll,
  onDeleteItem,
  onHeaderCellClick,
  fetchAccessorial,
  fetchAccessorials,
  onChecked,
  sortConfig,
}: Columns): AccessorialColumnType[] => {
  return [
    {
      title: <HeaderCell title="Name" />,
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (name) => {
        return name;
      },
    },
    {
      title: <HeaderCell title="Leg type" />,
      dataIndex: 'legType',
      key: 'legType',
      width: 250,
      render: (legType) => {
        return legType;
      },
    },
    {
      title: <HeaderCell title="Base Price" />,
      dataIndex: 'basePrice',
      key: 'basePrice',
      width: 250,
      render: (basePrice) => {
        return basePrice;
      },
    },
    {
      title: <HeaderCell title="Equipment" />,
      dataIndex: 'requiredEquipment',
      key: 'requiredEquipment',
      width: 150,
      render: (value: boolean) => getStatusBadge(value),
    },
    {
      title: (
        <HeaderCell
          title="Category"
          sortable
          ascending={
            sortConfig?.direction === 'asc' && sortConfig?.key === 'category'
          }
        />
      ),
      onHeaderCell: (): any => onHeaderCellClick('category'),
      dataIndex: 'category',
      key: 'category',
      width: 250,
      render: (category: Category) => category.name,
    },
    {
      title: <HeaderCell title="Actions" />,
      key: 'actions',
      width: 120,
      render: (_: any, row: Accessorial) => (
        <div className="flex gap-2">
          {/* <Tooltip content="View Details" placement="top">
            <ActionIcon
              onClick={async () => {
                if (fetchAccessorial) {
                  const accessorial = await fetchAccessorial(row.uuid);
                  if (accessorial) {
                    // Handle fetched accessorial data, e.g., display in a modal
                    console.log('Fetched Accessorial:', accessorial);
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
                  <EditAccessorial
                    accessorial={row}
                    fetchAccessorials={fetchAccessorials}
                  />
                }
                customSize="600px"
                className="mt-0 text-center"
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
