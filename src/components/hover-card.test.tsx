import { render, screen } from '@testing-library/react';
import { HoverCard } from './hover-card';
import React from 'react';

describe('HoverCard', () => {
  it('renders title and description correctly', () => {
    const title = 'Test Title';
    const description = 'Test Description';
    const icon = '🚀';
    const href = '/';
    render(
      <HoverCard title={title} description={description} icon={icon} href={href} />
    );
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText(icon)).toBeInTheDocument();
  });
});