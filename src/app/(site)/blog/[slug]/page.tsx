import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';

import { allPosts } from 'contentlayer/generated';
import Post from '~/app/(site)/blog/components/Post';

import configuration from '~/configuration';
import Container from '~/core/ui/Container';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    return;
  }

  const { title, date, description, image, slug } = post;
  const url = [configuration.site.siteUrl, 'blog', slug].join('/');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: date,
      url,
      images: image
        ? [
            {
              url: image,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

async function Blog({ params }: { params: { slug: string } }) {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <Container>
      <Script id={'ld-json'} type="application/ld+json">
        {JSON.stringify(post.structuredData)}
      </Script>

      <Post post={post} content={post.body.code} />
    </Container>
  );
}

export default Blog;
