/**
 * Customized fetcher that throws if the status code is not 2xx.
 *
 * @param {string|Request} url — the resource to fetch
 * @param {object} options —
 * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch
 */
export async function fetcher(url, options) {
  const res = await fetch(url, options);

  if (!res.ok) {
    const error = new Error('Error fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
}

/**
 * Customized fetcher to query GitHub's GraphQL API.
 *
 * @param {string} query — GraphQL query
 * @see https://docs.github.com/en/graphql/guides/forming-calls-with-graphql#communicating-with-graphql
 */
export async function fetchGQL(query) {
  return fetcher('https://api.github.com/graphql', {
   method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `token ${process.env.GITHUB_AUTH_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });
}
