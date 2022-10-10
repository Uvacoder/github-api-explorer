import { useRouter } from 'next/router';
import { IconMagnifier } from '~/components/Icons';
import { normalizeTopicName } from '~/utils/topic';

export default function Search() {
  const router = useRouter();

  const handleSubmit = (ev) => {
    ev.preventDefault();

    const topic = normalizeTopicName(ev.currentTarget.elements.q.value);

    if (!topic) {
      return;
    }

    ev.currentTarget.elements.q.value = '';

    router.push({
      pathname: '/topics/[topic]',
      query: { topic },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="u-df u-aic"
      role="search"
    >
      <label>
        <span className="u-sr-only">
          Search a topic
        </span>
        <input
          type="search"
          name="q"
          placeholder="Search a topic"
          minLength="1"
          maxLength="35"
          required
        />
        <button
          type="submit"
          className="icon-wrapper u-dif u-aic u-jcc"
          aria-label="Submit"
        >
          <IconMagnifier
            width={16}
            height={16}
            aria-hidden="true"
          />
        </button>
      </label>

      <style jsx>{`
        input {
          padding: 0.25em 1em;
          margin: 0;
          font: inherit;
          border-radius: 50px;
          border: 1px solid var(--accents-2);
          outline: none;
          box-shadow: inset var(--shadow-smallest);
          transition-property: color, border-color, box-shadow;
          transition-duration: 150ms;
          transition-timing-function: ease;
        }

        input:focus {
          border-color: var(--color-primary);
          box-shadow: var(--outline), inset var(--shadow-smallest);
        }

        .icon-wrapper {
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          border-radius: 20px;
        }

        .icon-wrapper,
        label:focus-within .icon-wrapper {
          display: none;
        }

        @media (max-width: 40em) {
          .icon-wrapper {
            display: inline-flex;
          }

          input {
            width: 0;
            opacity: 0;
          }

          label:focus-within {
            position: absolute;
            inset: 0 0 1px;
            padding: 0 1rem;
            display: flex;
            align-items: center;
            background-color: var(--accents-1);
          }

          label:focus-within input {
            width: 100%;
            opacity: 1;
          }
        }
      `}</style>
    </form>
  );
}
