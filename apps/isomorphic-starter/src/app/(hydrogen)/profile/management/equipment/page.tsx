import PageHeader from '@/app/shared/page-header';
import ModalButton from '@/app/shared/modal-button';
import RolesGrid from '@/app/shared/tags/tag-grid';
import CreateTag from '@/app/shared/tags/create-tag';

const pageHeader = {
  title: 'All Equipment',
  breadcrumb: [
    {
      name: 'Management'
    },
    {
      name: 'Equipment'
    },
  ],
};

export default function BlankPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <ModalButton label="Add New Equipment" view={<CreateTag />} className='bg-[#a5a234]'/>
      </PageHeader>
      <RolesGrid />
    </>
  );
}
