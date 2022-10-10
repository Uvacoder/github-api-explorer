import { waitFor, render, screen } from '@testing-library/react';
import RateLimit from '~/components/RateLimit';
import useSWR  from 'swr';

jest.mock('swr');

describe('components/RateLimit', () => {
  it('should render default state', async () => {
    useSWR.mockImplementation(() => ({ data: undefined, error: undefined }));
    render(<RateLimit />);

    await waitFor(() => {
      expect(screen.getByRole('region'))
        .toHaveTextContent('0 requests left');
    })
  });

  it('should render error state', async () => {
    useSWR.mockImplementation(() => ({ error: true }));
    render(<RateLimit />);

    await waitFor(() => {
      expect(screen.getByTestId('rate-limit-error'))
        .toBeInTheDocument();
    });
  });

  it('should render remaining requests', async () => {
    useSWR.mockImplementation(() => ({ data: { rateLimit: { remaining: 100 }} }));
    render(<RateLimit />);

    await waitFor(() => {
      expect(screen.getByRole('region'))
        .toHaveTextContent('100 requests left');
    })
  });
});
