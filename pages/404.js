export default function Page404() {
  return (
    <div className="root u-dif u-aic">
      <h1 className="u-fw500">404</h1>
      <h2 className="u-fw400">This page could not be found.</h2>

      <style jsx>{`
        .root {
          align-self: center;
        }

        h1 {
          font-size: 1.5rem;
          padding-inline-end: 1rem;
          margin-inline-end: 1rem;
          border-inline-end: 1px solid var(--accents-2);
        }

        h2 {
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}
