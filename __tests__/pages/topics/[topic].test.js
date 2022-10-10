import { render, screen } from '@testing-library/react';
import PageTopic, { getServerSideProps } from '~/pages/topics/[topic]';
import StarsCounter from '~/components/StarsCounter';
import TopicPill from '~/components/TopicPill';
import { fetchGQL } from '~/utils/fetchers';

jest.mock('~/components/StarsCounter');
jest.mock('~/components/TopicPill');
jest.mock('~/utils/fetchers', () => {
  const original = jest.requireActual('~/utils/fetchers');
  return {
    ...original,
    fetchGQL: jest.fn(),
  };
});

StarsCounter.mockReturnValue(<div data-testid="stars-counter" />);
TopicPill.mockReturnValue(<div data-testid="topic-pill" />);

describe('pages/topics/[topic]', () => {
  const MOCK_DATA = {
    topic: {
      id: '1',
      name: 'javascript',
      stargazerCount: 1,
      relatedTopics: [
        {
          id: '2',
          name: 'nodejs',
          stargazerCount: 2
        },
        {
          id: '3',
          name: 'wasm',
          stargazerCount: 3
        },
      ],
    }
  };

  it('should render headings', () => {
    render(<PageTopic data={MOCK_DATA} />);
    const h1 = screen.getAllByRole('heading', { level: 1 });
    const h2 = screen.getAllByRole('heading', { level: 2 });

    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent('javascript');

    expect(h2).toHaveLength(1);
  });

  it('should display related topics (components/TopicPill)', () => {
    render(<PageTopic data={MOCK_DATA}  />);

    expect(screen.getAllByTestId('topic-pill'))
      .toHaveLength(2);
  });

  it('should display stargazers count (components/StarsCounter)', () => {
    render(<PageTopic data={MOCK_DATA}  />);

    expect(screen.getAllByTestId('stars-counter'))
      .toHaveLength(1);
  });

  it('should display no related topics state', () => {
    const data = JSON.parse(JSON.stringify(MOCK_DATA));
    data.topic.relatedTopics = [];
    render(<PageTopic data={ data }  />);

    expect(screen.queryAllByTestId('topic-pill'))
      .toHaveLength(0);

    expect(screen.getAllByRole('heading', { level: 1 }))
      .toHaveLength(1);

    expect(screen.getAllByRole('heading', { level: 2 }))
      .toHaveLength(1);
  });

  describe('getServerSideProps', () => {
    it('should call fetchGQL API', async () => {
      fetchGQL.mockImplementation(() => Promise.resolve({ data: MOCK_DATA }));
      const response = await getServerSideProps({ query: { topic: 'react' } });

      expect(response).toEqual(
        expect.objectContaining({
          props: {
            data: MOCK_DATA,
          }
        })
      );
    });

    it('should return 404 if no topic is provided', async () => {
      fetchGQL.mockImplementation(() => Promise.resolve({ data: MOCK_DATA }));
      const response = await getServerSideProps({ query: { topic: '' } });

      expect(response).toEqual({ notFound: true });
    });

    it('should return 404 if response topic is null', async () => {
      fetchGQL.mockReturnValueOnce(JSON.stringify({ data: { topic: null } }));
      const response = await getServerSideProps({ query: { topic: 'nextjs' } });

      expect(response).toEqual({ notFound: true });
    });

    it('should handle errors', async () => {
      fetchGQL.mockImplementationOnce(() => ({ ok: false, json: () => {} }))
      const response = await getServerSideProps({ query: { topic: 'hello' } });

      expect(response).toEqual({ notFound: true });
    });
  });
});
