import rateLimit from '~/pages/api/rate-limit';
import { fetchGQL } from '~/utils/fetchers';

const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({ json: mockJson }));

jest.mock('~/utils/fetchers', () => {
  const original = jest.requireActual('~/utils/fetchers');
  return {
    ...original,
    fetchGQL: jest.fn(),
  };
});

describe.only('/api/rate-limit', () => {
  beforeEach(() => {
    mockJson.mockClear();
    mockStatus.mockClear();
  });

  it('should return remaining requests', async () => {
    const res = {
      status: mockStatus,
      json: mockJson,
    };

    fetchGQL.mockReturnValueOnce({
      data: {
        rateLimit: {
          remaining: 10
        }
      }
    });
    await rateLimit(undefined, res);

    expect(res.status.mock.calls[0][0])
      .toEqual(200);

    expect(res.json.mock.calls[0][0].rateLimit.remaining)
      .toEqual(10);
  });

  it('should handle errors', async () => {
    const res = {
      status: mockStatus,
      json: mockJson,
    };

    fetchGQL.mockRejectedValueOnce('error message')
    await rateLimit(undefined, res);

    expect(res.status.mock.calls[0][0])
      .toEqual(500);

    expect(res.json.mock.calls[0][0])
      .toEqual('error message');
  });
});
