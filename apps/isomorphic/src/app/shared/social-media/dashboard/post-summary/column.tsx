import AvatarCard from '@ui/avatar-card';
import { PiEyeFill } from 'react-icons/pi';
import { formatNumber } from '@utils/format-number';
import CommentsIcon from '@components/icons/comments';
import ThumbsUpIcon from '@components/icons/thumbs-up';
import InstagramIcon from '@components/icons/instagram';
import { createColumnHelper } from '@tanstack/react-table';
import LinkedInSquareIcon from '@components/icons/linkedin-square';
import FacebookSquareIcon from '@components/icons/facebook-square';
import { PostSummaryDataType } from '@/data/social-media-dashboard-data';

const columnHelper = createColumnHelper<PostSummaryDataType>();

export const defaultColumns = [
  columnHelper.accessor('image', {
    size: 300,
    header: 'Post Content',
    cell: ({ row: { original } }) => (
      <AvatarCard
        src={original.image}
        name={original.title}
        nameClassName="line-clamp-1"
        description={<span className="text-primary">{original.link}</span>}
        avatarProps={{
          rounded: 'sm',
          name: original.title,
          className: '!bg-transparent border border-muted overflow-hidden',
        }}
      />
    ),
  }),
  columnHelper.accessor('availabilityDate', {
    size: 160,
    header: 'Availability Date',
  }),
  columnHelper.accessor('views', {
    size: 120,
    header: 'Views',
    cell: (info) => (
      <div className="flex items-center gap-1">
        <PiEyeFill className="size-4 text-green" />
        {formatNumber(info.getValue())}
      </div>
    ),
  }),
  columnHelper.accessor('likes', {
    size: 120,
    header: 'Likes',
    cell: (info) => (
      <div className="flex items-center gap-1">
        <ThumbsUpIcon className="size-4" />
        {formatNumber(info.getValue())}
      </div>
    ),
  }),
  columnHelper.accessor('comments', {
    size: 120,
    header: 'Comments',
    cell: (info) => (
      <div className="flex items-center gap-1">
        <CommentsIcon className="size-4 text-primary" />
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('platforms', {
    size: 120,
    header: 'Platforms',
    cell: () => (
      <div className="flex items-center gap-1.5">
        <FacebookSquareIcon className="size-4" />
        <InstagramIcon className="size-4" />
        <LinkedInSquareIcon className="size-4" />
      </div>
    ),
  }),
];
