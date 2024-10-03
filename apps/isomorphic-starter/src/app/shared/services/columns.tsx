'use client';

import { Badge, Text, Tooltip, ActionIcon } from 'rizzui';
import { HeaderCell } from '@/app/shared/table';
import DeletePopover from '@/app/shared/delete-popover';
import { ColumnType } from 'rc-table';
import ModalButton from '@/app/shared/modal-button';
import EditService from './edit-service';
import { Type, Service } from '.';

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
  data: Service[];
  sortConfig?: any;
  handleSelectAll: () => void;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
  handleEditClick: any;
  fetchService?: (id: string) => Promise<Service | null>;
  fetchServices?: () => Promise<Service[] | null>;
};

type ServiceColumnType = ColumnType<Service>;

export const getColumns = ({
  data,
  checkedItems,
  handleEditClick,
  handleSelectAll,
  onDeleteItem,
  onHeaderCellClick,
  fetchService,
  fetchServices,
  onChecked,
  sortConfig,
}: Columns): ServiceColumnType[] => {
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
      title: <HeaderCell title="Offering" />,
      dataIndex: 'offering',
      key: 'offering',
      width: 250,
      render: (offering) => {
        return offering;
      },
    },

    {
      title: (
        <HeaderCell
          title="Connection"
          sortable
          ascending={
            sortConfig?.direction === 'asc' && sortConfig?.key === 'connection'
          }
        />
      ),
      onHeaderCell: (): any => onHeaderCellClick('connection'),
      dataIndex: 'connection',
      key: 'connection',
      width: 250,
      render: (connection) => {
        return connection;
      },
    },

    {
      title: (
        <HeaderCell
          title="Type"
          sortable
          ascending={
            sortConfig?.direction === 'asc' && sortConfig?.key === 'type'
          }
        />
      ),
      onHeaderCell: (): any => onHeaderCellClick('type'),
      dataIndex: 'type',
      key: 'type',
      width: 250,
      render: (type: Type) => type?.name,
    },

    {
      title: <HeaderCell title="Min Markup" />,
      dataIndex: 'minMarkup',
      key: 'minMarkup',
      width: 250,
      render: (minMarkup) => {
        return minMarkup;
      },
    },
    {
      title: <HeaderCell title="Max Markup" />,
      dataIndex: 'maxMarkup',
      key: 'maxMarkup',
      width: 250,
      render: (maxMarkup) => {
        return maxMarkup;
      },
    },
    {
      title: <HeaderCell title="Markup" />,
      dataIndex: 'markup',
      key: 'markup',
      width: 250,
      render: (markup) => {
        return markup;
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
      render: (_: any, row: Service) => (
        <div className="flex gap-2">
          <Tooltip content="Edit" placement="top">
            <ActionIcon onClick={() => handleEditClick(row.uuid)}>
              <ModalButton
                label="Edit"
                view={
                  <EditService service={row} fetchServices={fetchServices} />
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
