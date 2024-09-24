import { FaTrash } from 'react-icons/fa';
import { Title, ActionIcon, Text } from 'rizzui';
import cn from '@utils/class-names';
import UserCog from '@components/icons/user-cog';
import ModalButton from '@/app/shared/modal-button';
import EditTerm from './edit-terms';
// @ts-ignore
import Cookies from 'js-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import { baseUrl } from '@/config/url';

interface TermCardProps {
  name: string;
  numberOfDays: number;
  uuid: string;
  className?: string;
  fetchTerms: any;
}

export async function deleteTerm(uuid: string) {
  const user: any = JSON.parse(Cookies.get('user'));
  const token = user.token;
  const uuids: string[] = [uuid];

  const response = await axios.delete(
    `${baseUrl}/api/v1/payment-terms/delete`,
    {
      data: { uuids },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 200) {
    toast.success(<Text>Successfully deleted.</Text>, { duration: 5000 });
    window.location.reload();
  } else {
    toast.error(<Text>Error deleting payment term.</Text>, { duration: 5000 });
  }
}

export default function TermCard({
  name,
  numberOfDays,
  className,
  uuid,
  fetchTerms,
}: TermCardProps) {
  return (
    <div className={cn('rounded-lg border border-muted p-6', className)}>
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-content-center rounded-lg text-white" />
          <div className="flex flex-col">
            <Title as="h4" className="font-medium">
              {name}
            </Title>
            <p>{numberOfDays} Days</p>
          </div>
        </div>

        <ActionIcon
          variant="text"
          className="ml-auto h-auto w-auto p-1"
          onClick={() => deleteTerm(uuid)}
        >
          <FaTrash className="h-auto w-4" style={{ color: '#284783' }} />
        </ActionIcon>
      </header>

      <ModalButton
        variant="outline"
        label="Edit Payment Term"
        icon={<UserCog className="h-5 w-5" />}
        view={
          <EditTerm
            term={{ name, numberOfDays, uuid }}
            fetchTerms={fetchTerms}
          />
        }
        className="items-center gap-1 text-gray-800 @lg:w-full lg:mt-6"
      />
    </div>
  );
}
