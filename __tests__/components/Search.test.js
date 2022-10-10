import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from '~/components/Search';
import { useRouter } from "next/router";

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockRouter = { push: jest.fn() };
useRouter.mockReturnValue(mockRouter);

describe('components/Search', () => {

  beforeEach(() => {
    mockRouter.push.mockClear();
  });

  it('should be required', () => {
    render(<Search />);
    expect(screen.getByRole('searchbox', { name: /search a topic/i }))
      .toBeRequired();
  });

  it('should not be valid', () => {
    render(<Search />);
    expect(screen.getByRole('searchbox', { name: /search a topic/i }))
      .not.toBeValid();
  });

  it('should have an accessible name', () => {
    render(<Search />);
    expect(screen.getByRole('searchbox', { name: /search a topic/i }))
      .toHaveAccessibleName('Search a topic');
  });

  it('should have attribute placeholder', () => {
    render(<Search />);
    expect(screen.getByRole('searchbox', { name: /search a topic/i }))
      .toHaveAttribute('placeholder', 'Search a topic')
  });

  it('should have attribute minLength', () => {
    render(<Search />);
    expect(screen.getByRole('searchbox', { name: /search a topic/i }))
      .toHaveAttribute('minLength', '1')
  });

  it('should have attribute maxLength', () => {
    render(<Search />);
    expect(screen.getByRole('searchbox', { name: /search a topic/i }))
      .toHaveAttribute('maxLength', '35')
  });

  describe('when typing', () => {
    it('should be valid with 1 at least character', async () => {
      render(<Search />);
      const user = userEvent.setup();
      const input = screen.getByRole('searchbox', { name: /search a topic/i });

      await user.type(input, 'r');

      expect(input)
        .toBeValid();
    });

    it('should not allow more than 35 characters', async () => {
      render(<Search />);
      const user = userEvent.setup();
      const input = screen.getByRole('searchbox', { name: /search a topic/i });

      await user.type(input, 'a'.repeat(100));

      expect(input.value.length)
        .toBe(35);
    });

  });

  describe('when navigating', () => {
    it('should focus input on tab', async () => {
      render(<Search />);
      const user = userEvent.setup();
      const input = screen.getByRole('searchbox', { name: /search a topic/i });

      await user.tab();

      expect(input)
        .toHaveFocus();
    });

    it('should focus input on label click', async () => {
      render(<Search />);
      const user = userEvent.setup();
      const input = screen.getByRole('searchbox', { name: /search a topic/i });
      const label = screen.getByLabelText('Search a topic');

      await user.click(label);

      expect(input)
        .toHaveFocus();
    });
  });

  describe('when submitted', () => {
    it('should not submit if empty', async () => {
      render(<Search />);
      const user = userEvent.setup();
      const input = screen.getByRole('searchbox', { name: /search a topic/i });

      await user.type(input, ' ');
      await user.keyboard('[Enter]');

      expect(mockRouter.push)
        .toHaveBeenCalledTimes(0);
    });

    it('should submit form, clear its value and redirect to page', async () => {
      render(<Search />);
      const user = userEvent.setup();
      const input = screen.getByRole('searchbox', { name: /search a topic/i });

      await user.type(input, 'react');
      await user.keyboard('[Enter]');

      expect(mockRouter.push)
        .toHaveBeenCalledWith({
          pathname: '/topics/[topic]',
          query: { topic: 'react'}
        });

      expect(input.value)
        .toBe('');
    });

    it('should remove whitespaces in either end', async () => {
      render(<Search />);
      const user = userEvent.setup();
      const input = screen.getByRole('searchbox', { name: /search a topic/i });

      await user.type(input, '   react   ');
      await user.keyboard('[Enter]');

      expect(mockRouter.push)
        .toHaveBeenCalledWith({
          pathname: '/topics/[topic]',
          query: { topic: 'react'}
        });
    });

    it('should replace inner whitespaces with dash', async () => {
      render(<Search />);
      const user = userEvent.setup();
      const input = screen.getByRole('searchbox', { name: /search a topic/i });

      await user.type(input, '   deep    learning   ');
      await user.keyboard('[Enter]');

      expect(mockRouter.push)
        .toHaveBeenCalledWith({
          pathname: '/topics/[topic]',
          query: { topic: 'deep-learning'}
        });
    });

    it('should transform text to lowercase', async () => {
      render(<Search />);
      const user = userEvent.setup();
      const input = screen.getByRole('searchbox', { name: /search a topic/i });

      await user.type(input, '   mAchInE    LearNing   ');
      await user.keyboard('[Enter]');

      expect(mockRouter.push)
        .toHaveBeenCalledWith({
          pathname: '/topics/[topic]',
          query: { topic: 'machine-learning'}
        });
    });

    it('should remove emojis', async () => {
      render(<Search />);
      const user = userEvent.setup();
      const input = screen.getByRole('searchbox', { name: /search a topic/i });

      await user.type(input, '  😀 mAchInE  ☺️  LearNing 😇  ');
      await user.keyboard('[Enter]');

      expect(mockRouter.push)
        .toHaveBeenCalledWith({
          pathname: '/topics/[topic]',
          query: { topic: 'machine-learning'}
        });
    });

    it('should remove accents/diacritics', async () => {
      render(<Search />);
      const user = userEvent.setup();
      const input = screen.getByRole('searchbox', { name: /search a topic/i });

      await user.type(input, 'rèact 😄  bublé 👏🏿tôdo  ');

      await user.keyboard('[Enter]');

      expect(mockRouter.push)
        .toHaveBeenCalledWith({
          pathname: '/topics/[topic]',
          query: { topic: 'react-buble-todo'}
        });
    });
  });
});
