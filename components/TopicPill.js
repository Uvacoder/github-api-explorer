import { number, shape, string } from 'prop-types';
import Link from 'next/link';
import StarsCounter from '~/components/StarsCounter';

const propTypes = {
  topic: shape({
    id: string.isRequired,
    name: string.isRequired,
    stargazerCount: number.isRequired,
  }).isRequired,
};

export default function TopicPill({
  topic,
}) {
  return (
    <>
      <Link href={`/topics/${topic.name}`}>
        <a
          className="root u-df u-aic"
          title={`Topic: ${topic.name}`}
        >
          <span className="term u-fw700">
            {topic.name}
          </span>
          <StarsCounter
            className="counter"
            count={topic.stargazerCount}
          />
        </a>
      </Link>

      <style jsx>{`
        .root {
          gap: .75rem;
          padding: 0.25em 1.5em;
          background-color: var(--color-background);
          border: 1px solid var(--accents-1);
          border-radius: 100px;
          box-shadow: var(--shadow-smallest);
          transition-properties: color, border-color, box-shadow;
          transition-duration: 150ms;
          transition-timing-function: ease;
          outline: none;
        }

        .root:is(:hover, :focus, :active) {
          color: var(--color-primary);
          border-color: var(--color-primary);
          box-shadow: var(--outline), var(--shadow-small);
        }

        .term {
          font-size: 1.5rem;
        }

        .root :global(.counter) {
          font-size: .75rem;
        }
      `}</style>
    </>
  );
}

TopicPill.propTypes = propTypes;
