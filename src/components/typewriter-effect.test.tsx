import { render, screen, waitFor } from '@testing-library/react';
import { TypewriterEffect } from './typewriter-effect';
import React from 'react';

describe('TypewriterEffect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders words sequentially with typewriter effect', async () => {
    const text = 'Hello World';
    render(<TypewriterEffect text={text} />);

    const typewriterElement = screen.getByTestId('typewriter-text');
    expect(typewriterElement).toBeInTheDocument();

    // Initially, individual characters should be hidden
    expect(screen.queryByText('H')).not.toBeVisible();
    expect(screen.queryByText('W')).not.toBeVisible();

    // Advance timers to show the first word
    jest.advanceTimersByTime(5 * 150 + 1000); // 150ms per char, 1000ms delay for 'Hello'
    await waitFor(() => {
      expect(typewriterElement).toHaveTextContent('Hello');
    });

    // Advance timers to show the second word
    jest.advanceTimersByTime(5 * 150 + 1000); // 150ms per char, 1000ms delay for 'World'
    await waitFor(() => {
      expect(typewriterElement).toHaveTextContent('HelloWorld');
    });
  });

  it('applies default styling classes', async () => {
    const text = 'Test';
    render(<TypewriterEffect text={text} />);

    const typewriterElement = screen.getByTestId('typewriter-text');
    expect(typewriterElement).toHaveClass('text-4xl', 'font-bold');
  });

  it('handles empty text gracefully', () => {
    render(<TypewriterEffect text="" />);
    const typewriterElement = screen.getByTestId('typewriter-text');
    expect(typewriterElement).toHaveTextContent('');
  });
});