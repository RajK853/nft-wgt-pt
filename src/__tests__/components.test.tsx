// Component Tests
// Unit tests for UI components using React Testing Library.

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Import components to test
import { Button } from '../components/ui/button';
import { MetricCard } from '../components/ui/MetricCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

describe('Button Component', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should render different variants', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('MetricCard Component', () => {
  it('should render with label and value', () => {
    render(<MetricCard label="Total Score" value={1000} />);
    expect(screen.getByText('Total Score')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
  });

  it('should render with string value', () => {
    render(<MetricCard label="Score" value="N/A" />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should show delta when provided', () => {
    render(<MetricCard label="Score" value={100} delta={10} />);
    expect(screen.getByText('+10')).toBeInTheDocument();
  });

  it('should show negative delta', () => {
    render(<MetricCard label="Score" value={100} delta={-5} />);
    expect(screen.getByText('-5')).toBeInTheDocument();
  });

  it('should render with different variants', () => {
    const { rerender } = render(<MetricCard label="Score" value={100} variant="success" />);
    expect(screen.getByText('100')).toBeInTheDocument();

    rerender(<MetricCard label="Score" value={100} variant="danger" />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});

describe('LoadingSpinner Component', () => {
  it('should render spinner', () => {
    render(<LoadingSpinner />);
    // Spinner is a div with animate-spin class
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should render with custom text', () => {
    render(<LoadingSpinner text="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });
});
