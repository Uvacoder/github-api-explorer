import useSWR from 'swr';
import { fetcher } from '~/utils/fetchers';

const ErrorState = () => (
  <small data-testid="rate-limit-error">
    <svg
      viewBox="0 0 10 10"
      width={10}
      height={10}
    >
      <circle r={5} cx={5} cy={5} />
    </svg>
    API failure

    <style jsx>{`
      small { color: var(--color-danger) }
      svg { margin-inline-end: 0.5em }
    `}</style>
  </small>
);

export default function RateLimit() {
  const { data, error } = useSWR('/api/rate-limit', fetcher, {
    refreshInterval: 5000,
  });

  if (error) {
    return <ErrorState />;
  }

  return (
    <div>
      <small
        role="region"
        aria-live="polite"
      >
        <span className="u-fw700">
          {(data?.rateLimit?.remaining ?? 0).toLocaleString()}
        </span>
        {' '}
        requests left
      </small>
    </div>
  );
}
