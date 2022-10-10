import { render, screen } from '@testing-library/react';
import StarsCounter from '~/components/StarsCounter';

describe('components/StarsCounter', () => {
  it('should render as span by default', () => {
    render(<StarsCounter />);
    expect(screen.getByTestId('stars-count').tagName)
      .toBe('SPAN');
  });

  it('should render as listitem', () => {
    render(<StarsCounter as="li" />);
    expect(screen.getByRole('listitem'))
      .toBeInTheDocument();
  });

  it('should render default count prop value', () => {
    render(<StarsCounter />);
    expect(screen.getByTestId('stars-count'))
      .toHaveTextContent(0);
  });

  it('should have aria-label attribute', () => {
    render(<StarsCounter count={12345} />);
    expect(screen.getByTestId('stars-count'))
      .toHaveAttribute('aria-label', '12345 users starred this topic');
  });

  it('should render star icon hidden to screen readers', () => {
    render(<StarsCounter count={1} />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
  });

  it('should render count with compact format', () => {
    render(<StarsCounter count={1000} />);
    expect(screen.getByText(/1k/i))
      .toBeInTheDocument();
  });

  it('should render count title attribute formatted in the default locale', () => {
    render(<StarsCounter count={1000} />);
    expect(screen.getByText(/1k/i))
      .toHaveAccessibleName('1,000');
  });
});
