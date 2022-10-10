import { render, screen } from '@testing-library/react';
import Header from '~/components/Header';
import Search from '~/components/Search';

jest.mock('~/components/Search');

Search.mockReturnValue(<div data-testid="search" />);

describe('components/Header', () => {
  it('should render header tag', () => {
    render(<Header />);
    expect(screen.getByRole('banner'))
      .toBeInTheDocument();
  });

  it('should render anchor to home', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /github topic explorer/i }))
      .toHaveAttribute('href', '/');
  });

  it('should render the search input', () => {
    render(<Header />);
    expect(screen.getByTestId('search'))
      .toBeInTheDocument();
  });
});
