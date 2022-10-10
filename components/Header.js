import Link from 'next/link';
import Search from '~/components/Search';

export default function Header() {
  return (
    <header className="u-df">
      <Link href="/">
        <a className="u-df u-aic u-fw600">
          GitHub Topic Explorer
        </a>
      </Link>

      <Search />

      <style jsx>{`
        header {
          position: sticky;
          top: 0;
          height: 60px;
          gap: 1rem;
          justify-content: space-between;
          padding-inline: 1rem;
          border-bottom: 1px solid var(--accents-1);
          background-color: var(--color-header-background);
          backdrop-filter: blur(5px);
        }
      `}</style>
    </header>
  );
}
