import React from 'react';
import { Post } from 'contentlayer/generated';

import PostHeader from './PostHeader';
import MDXRenderer from '~/core/ui/MDXRenderer/MDXRenderer';

const Post: React.FCC<{
  post: Post;
  content: string;
}> = ({ post, content }) => {
  return (
    <div className={'mx-auto max-w-2xl my-8'}>
      <PostHeader post={post} />

      <article className={'mx-auto flex justify-center'}>
        <MDXRenderer code={content} />
      </article>
    </div>
  );
};

export default Post;
