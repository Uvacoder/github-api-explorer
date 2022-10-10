import { normalizeTopicName } from '~/utils/topic';
import { fetchGQL } from '~/utils/fetchers';

export default function TopicPage({ data }) {
  return (
    <div>
      <h1>{data.topic.name}</h1>
      <h2>Related topics</h2>
      {data.topic.relatedTopics.map((topic) => (
        <div key={topic.id}>
          {topic.name} ({topic.stargazerCount})
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const name = normalizeTopicName(query.topic);

  if (!name) {
    return {
      notFound: true
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
