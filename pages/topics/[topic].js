import Head from 'next/head';
import Link from 'next/link';
import { normalizeTopicName } from '~/utils/topic';
import { fetchGQL } from '~/utils/fetchers';

export default function TopicPage({ data }) {
  return (
    <div>
      <Head>
        <title>
          {`${data.topic.name} - GitHub Topic Explorer`}
        </title>
        <meta
          name="description"
          content={`"${data.topic.name}", has {data.topic.relatedTopics.length} related topics.`}
        />
      </Head>

      <h1>{data.topic.name}</h1>
      <h2>Related topics</h2>
      {data.topic.relatedTopics.map((topic) => (
        <Link
          href={`/topics/${topic.name}`}
          key={topic.id}
        >
          <a data-testid="topic-item">
            {topic.name} ({topic.stargazerCount})
          </a>
        </Link>
      ))}
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const name = normalizeTopicName(query.topic);

  if (!name) {
    return {
      notFound: true,
    };
  }

  try {
    const response = await fetchGQL(`{
      topic(name: "${name}") {
        id,
        name,
        stargazerCount,
        relatedTopics(first: 10) {
          id,
          name,
          stargazerCount,
        }
      }
    }`);

    if (response.data.topic === null)
      throw 'Not found';

    return {
      props: {
        data: response.data,
      },
    };
  } catch(err) {
    return {
      notFound: true,
    };
  }
}
