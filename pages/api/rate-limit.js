import { fetchGQL } from '~/utils/fetchers';

export default async function handler(req, res) {
  try {
    const response = await fetchGQL(`{
      rateLimit {
        remaining
      }
    }`);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json(err);
  }
}
