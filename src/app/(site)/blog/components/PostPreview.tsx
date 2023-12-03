import Link from 'next/link';
import { Post } from 'contentlayer/generated';

import If from '~/core/ui/If';

import DateFormatter from './DateFormatter';
import CoverImage from './CoverImage';

type Props = {
  post: Post;
  preloadImage?: boolean;
  imageHeight?: string | number;
};

const DEFAULT_IMAGE_HEIGHT = 250;

function PostPreview({
  post,
  preloadImage,
  imageHeight,
}: React.PropsWithChildren<Props>) {
  const { title, image, date, readingTime, description } = post;
  const height = imageHeight ?? DEFAULT_IMAGE_HEIGHT;

  return (
    <div className="rounded-xl transition-shadow duration-500 dark:text-gray-800">
      <If condition={image}>
        {(imageUrl) => (
          <div className="relative mb-2 w-full" style={{ height }}>
            <Link href={post.url}>
              <CoverImage
                preloadImage={preloadImage}
                title={title}
                src={imageUrl}
              />
            </Link>
          </div>
        )}
      </If>

      <div className={'px-1'}>
        <div className="flex flex-col space-y-1 px-1 py-2">
          <h3 className="px-1 text-2xl font-bold leading-snug dark:text-white">
            <Link href={post.url} className="hover:underline">
              {title}
            </Link>
          </h3>
        </div>

        <div className="mb-2 flex flex-row items-center space-x-2 px-1 text-sm">
          <div className="text-gray-600 dark:text-gray-300">
            <DateFormatter dateString={date} />
          </div>

          <span className="text-gray-600 dark:text-gray-300">·</span>

          <span className="text-gray-600 dark:text-gray-300">
            {readingTime} mins reading
          </span>
        </div>

        <p className="mb-4 px-1 text-sm leading-relaxed dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
}

export default PostPreview;
