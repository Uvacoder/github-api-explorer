import { render, screen } from '@testing-library/react';
import Footer from '~/components/Footer';
import RateLimit from '~/components/RateLimit';

jest.mock('~/components/RateLimit');

RateLimit.mockReturnValue(<div data-testid="rate-limit" />);

describe('components/Footer', () => {
  it('should render vercel link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /vercel/i }))
      .toHaveAttribute('href', 'https://vercel.com');
  });

  it('should render github api link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /github api/i }))
      .toHaveAttribute('href', 'https://docs.github.com/en/graphql');
  });

  it('should render components/RateLimit', () => {
    render(<Footer />);
    expect(screen.getByTestId('rate-limit'))
      .toBeInTheDocument();
  });

  it('should render text contents', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo'))
      .toHaveTextContent('Powered by Vercel and GitHub API');
  });
});
