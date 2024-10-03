'use client';

import { PiDotsThreeBold } from 'react-icons/pi';
import { Title, ActionIcon, Dropdown } from 'rizzui';
import cn from '@utils/class-names';
import UserCog from '@components/icons/user-cog';
import ModalButton from '@/app/shared/modal-button';
import axios from 'axios';
import { baseUrl } from '@/config/url';
// @ts-ignore
import Cookies from 'js-cookie';
import EditCategory from './edit-category';

interface CategoryProps {
  uuid: string;
  name: string;
  fetchCategories: any;
  fetchAccessorials: any;
}

export default function CategoryCard({
  uuid,
  name,
  fetchCategories,
  fetchAccessorials,
}: CategoryProps) {
  const handleRemoveCategory = async () => {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;
    const uuids: string[] = [uuid];

    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/categories/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { uuids },
        }
      );

      if (response.status === 200) {
        fetchCategories();
        fetchAccessorials();
      }
    } catch (error) {
      // Handle error here
      console.error('Error removing categories:', error);
    }
  };

  return (
    <div className={cn('rounded-lg border border-muted p-6')}>
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
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
              onClick={handleRemoveCategory}
            >
              Remove Category
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </header>

      <ModalButton
        customSize="700px"
        variant="outline"
        label="Edit Role"
        icon={<UserCog className="h-5 w-5" />}
        view={
          <div className="max-h-[450px] overflow-y-auto p-4">
            <EditCategory
              categoryUuid={uuid}
              fetchCategories={fetchCategories}
              fetchAccessorials={fetchAccessorials}
            />
          </div>
        }
        className="items-center gap-1 text-gray-800 @lg:w-full lg:mt-6"
      />
    </div>
  );
}
