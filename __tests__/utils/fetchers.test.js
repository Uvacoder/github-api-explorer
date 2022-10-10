import { fetcher, fetchGQL } from '~/utils/fetchers';

const MOCK_DATA = {
  topic: {
    name: 'react',
  },
};

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve(MOCK_DATA),
}));


describe('utils/fetchers', () => {
  describe('fetcher', () => {
    it('should reject', async () => {
      fetch.mockImplementationOnce(() => ({ ok: false, json: () => {} }))
      await expect(fetcher()).rejects.toThrow('Error fetching the data.');
    });

    it('should resolve', async() => {
      const data = await fetcher('http://');
      expect(data).toEqual(MOCK_DATA);
    });
  });

  describe('fetchGQL', () => {
    it('should reject', async () => {
      fetch.mockImplementationOnce(() => ({ ok: false, json: () => {} }))
      await expect(fetchGQL()).rejects.toThrow('Error fetching the data.');
    });

    it('should resolve', async() => {
      const data = await fetchGQL('query { }');
      expect(data).toEqual(MOCK_DATA);
    });
  });
});
