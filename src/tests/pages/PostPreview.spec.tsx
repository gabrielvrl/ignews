import { render, screen } from '@testing-library/react';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import getPrismicClient from '../../services/prismic';

const post = { slug: 'my-new-post', title: 'My new post', content: '<p>Post excerpt</p>', updatedAt: 'August, 4' }

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../services/prismic');

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<Post post={post} />);

    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  })

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' },
      false
    ] as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
  });

  it('loads initial data', async () => {
    const getSessionMocked = jest.mocked(getSession);
    const getPrismicClientMocked = jest.mocked(getPrismicClient);
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' },
      false
    ] as any);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: 'heading1',
              text: 'My new post',
            },
          ],
          content: [
            {
              type: 'paragraph',
              text: 'Post excerpt',
            },
          ],
        },
        last_publication_date: '04-01-2021',
      }),
    } as any);
    
    const response = await getStaticProps({
      params: { slug: 'my-new-post' }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post excerpt</p>',
            updatedAt: '01 de abril de 2021',
          }
        }
      })
    );
  });
})