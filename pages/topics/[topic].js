import { arrayOf, number, shape, string } from 'prop-types';
import Head from 'next/head';
import StarsCounter from '~/components/StarsCounter';
import TopicPill from '~/components/TopicPill';
import { normalizeTopicName } from '~/utils/topic';
import { fetchGQL } from '~/utils/fetchers';

const propTypes = {
  data: shape({
    topic: shape({
      id: string.isRequired,
      name: string.isRequired,
      stargazerCount: number.isRequired,
      relatedTopics: arrayOf(
        shape({
          id: string.isRequired,
          name: string.isRequired,
          stargazerCount: number.isRequired,
        }),
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default function TopicPage({ data }) {
  return (
    <div className="root">
      <Head>
        <title>
          {`${data.topic.name} - GitHub Topic Explorer`}
        </title>
        <meta
          name="description"
          content={`"${data.topic.name}", has {data.topic.relatedTopics.length} related topics.`}
        />
      </Head>

      <h1 className="break">
        {data.topic.name}
      </h1>

      <div className="stars u-df u-jcc">
        <StarsCounter count={data.topic.stargazerCount} />
        <span>stars</span>
      </div>

      <h2 className="description break u-fw500">
        {data.topic.relatedTopics.length ? (
          'Related topics'
        ) : (
          <>
            The <span className="u-fw700">{data.topic.name}</span> topic has no related topics, yet.
          </>
        )}
      </h2>

      <div className="grid u-df u-jcc u-aic">
        {data.topic.relatedTopics.map((topic) => {
          return (
            <TopicPill
              key={topic.id}
              topic={topic}
              name={topic.name}
              stargazerCount={topic.stargazerCount}
            />
          );
        })}
      </div>

      <style jsx>{`
        .root {
          text-align: center;
          padding: 4rem 0;
        }

        .break {
          word-break: break-word;
          hyphens: auto;
        }

        h1 {
          font-size: 4rem;
          margin: 0;
        }

        .stars {
          gap: .25em;
        }

        .description {
          font-size: 1rem;
          margin: 4rem 0 2rem;
        }

        .grid {
          flex-wrap: wrap;
          gap: 1rem;
          max-width: 800px;
          margin-inline: auto;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

TopicPage.propTypes = propTypes;

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
