import { render, screen } from '@testing-library/react';
import Page404 from '~/pages/404';

describe('pages/404', () => {
  it('should render', () => {
    render(<Page404/>);

    expect(screen.getByRole('heading', { level: 1 }))
      .toHaveTextContent('404');

    expect(screen.getByRole('heading', { level: 2 }))
      .toHaveTextContent('This page could not be found.');
  });
});
