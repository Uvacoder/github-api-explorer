import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TopicPill from '~/components/TopicPill';
import StarsCounter from '~/components/StarsCounter';

jest.mock('~/components/StarsCounter');

StarsCounter.mockReturnValue(<div data-testid="stars-counter" />);

describe('components/TopicPill', () => {

  it('should link to /topics/{term}', () => {
    render(<TopicPill topic={{ name: 'react', id: '1', stargazerCount: 1 }} />);
    const link = screen.getByRole('link', { name: /react/i });

    expect(link)
      .toHaveAttribute('href', '/topics/react');

    expect(link)
      .toHaveTextContent('react');

    expect(link)
      .toHaveAccessibleName('Topic: react');
  });

  it('should be focusable', async () => {
    render(<TopicPill topic={{ name: 'react', id: '1', stargazerCount: 1 }} />);
    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /react/i });

    await user.tab();

    expect(link)
      .toHaveFocus();
  });

  it('should render components/StarsCounter', () => {
    render(<TopicPill topic={{ name: 'react', id: '1', stargazerCount: 1 }} />);

    expect(screen.getByTestId('stars-counter'))
      .toBeInTheDocument();
  });
});
