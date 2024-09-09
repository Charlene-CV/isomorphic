import PageHeader from '@/app/shared/page-header';
import ModalButton from '@/app/shared/modal-button';
import TagsGrid from '@/app/shared/roles-permissions/tag-grid';
import CreateTag from '@/app/shared/roles-permissions/create-tag';

const pageHeader = {
  title: 'All Tags',
  breadcrumb: [
    {
      name: 'Management'
    },
    {
      name: 'Tags'
    },
  ],
};

export default function BlankPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <ModalButton label="Add New Tag" view={<CreateTag />} className='bg-[#a5a234]'/>
      </PageHeader>
      <TagsGrid />
    </>
  );
}
