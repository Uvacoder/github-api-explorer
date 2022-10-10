import { number, string } from 'prop-types';

const propTypes = {
  as: string,
  className: string,
  count: number,
};

export default function StarsCounter({
  as: As = 'span',
  className = '',
  count = 0,
}) {
  const formatted = Intl.NumberFormat().format(count);
  const compact = Intl.NumberFormat(undefined, { notation: 'compact' }).format(count);

  return (
    <As
      className={`root u-df u-aic ${className}`}
      aria-label={`${count} users starred this topic`}
      data-testid="stars-count"
    >
      <svg
        viewBox="0 0 16 16"
        className="star"
        width={16}
        height={16}
        aria-hidden="true"
        role="img"
      >
        <path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
      </svg>
      {' '}
      <span title={count != formatted ? formatted : undefined}>
        {compact}
      </span>

      <style jsx>{`
        .root {
          gap: 0.5em;
        }
        .root :global(.star) {
          stroke: var(--color-warning);
          fill: none;
        }
      `}</style>
    </As>
  );
}

StarsCounter.propTypes = propTypes;
