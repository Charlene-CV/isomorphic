import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import { Title, ActionIcon, Text } from 'rizzui';
import cn from '@utils/class-names';
import UserCog from '@components/icons/user-cog';
import { useModal } from '@/app/shared/modal-views/use-modal';
import ModalButton from '@/app/shared/modal-button';
import EditTag from '@/app/shared/roles-permissions/edit-tag';
// @ts-ignore
import Cookies from "js-cookie";
import axios from 'axios';
import toast from 'react-hot-toast';

interface TagCardProps {
  name: string;
  icon: string;
  className?: string
  uuid: string
}

export async function deleteTag(name: string) {
    const user: any = JSON.parse(Cookies.get("user"));
    const token = user.token;
    const names: string[] = [name];
    const response = await axios.delete(
      `http://192.168.0.146:8080/api/v1/tags/delete`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: { names }
      });
    if (response.status === 200) {
      toast.success(<Text>Successfully deleted.</Text>, { duration: 5000 });
      window.location.reload();
    } else {
      toast.error(<Text>Error deleting tag.</Text>, { duration: 5000 });
    }
}

export default function TagCard({
  name,
  icon,
  className,
  uuid
}: TagCardProps) {

  return (
    <div className={cn('rounded-lg border border-muted p-6', className)} >
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className="grid h-10 w-10 place-content-center rounded-lg text-white"
          >
          </span>
          <Title as="h4" className="font-medium">
            {name}
          </Title>
        </div>

        <ActionIcon variant="text" className="ml-auto h-auto w-auto p-1" onClick={() => deleteTag(name)}>
          <FaTrash className="h-auto w-4" style={{ color: '#284783' }} />
        </ActionIcon>
      </header>

      <ModalButton
        variant="outline"
        label="Edit Tag"
        icon={<UserCog className="h-5 w-5" />}
        view={<EditTag name={name} icon={icon} isActive uuid={uuid}/>}
        className="items-center gap-1 text-gray-800 @lg:w-full lg:mt-6"
      />
    </div>
  );
}
