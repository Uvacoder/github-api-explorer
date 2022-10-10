import Header from '~/components/Header';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <main className="u-df u-jcc">
        <Component {...pageProps} />
      </main>

      <style jsx>{`
        main {
          flex: 1;
          padding-inline: 1rem;
          background-image: linear-gradient(180deg, var(--color-background), var(--accents-1));
        }
      `}</style>
    </>
  );
}

export default MyApp
