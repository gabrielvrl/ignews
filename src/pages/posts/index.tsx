import { GetStaticProps } from 'next';
import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <a href="#">{post.title}</a>
            <p>{post.excerpt}</p>
            <small>{post.updatedAt}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    Prismic.Predicates.at('document.type', 'publication')
  );

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }; 
  })

  return {
    props: {
      posts
    }
  }
}
