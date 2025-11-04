import { render, screen } from '@testing-library/react';
import { CircularLogo } from './circular-logo';
import React from 'react';

describe('CircularLogo', () => {
  it('renders the logo with the hardcoded alt attribute', () => {
    const alt = 'NFT Logo';
    render(<CircularLogo />);

    const imgElement = screen.getByAltText(alt);
    expect(imgElement).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-logo-class';
    render(<CircularLogo className={customClass} />);

    const divElement = screen.getByRole('img').closest('div');
    expect(divElement).toHaveClass(customClass);
  });

  it('renders with default styling classes and inline styles', () => {
    const alt = 'NFT Logo';
    render(<CircularLogo />);

    const divElement = screen.getByRole('img').closest('div');
    expect(divElement).toHaveClass('rounded-full', 'overflow-hidden');
    expect(divElement).toHaveStyle('width: 150px');
    expect(divElement).toHaveStyle('height: 150px');

    const imgElement = screen.getByAltText(alt);
    expect(imgElement).toHaveClass('w-full', 'h-full', 'object-cover');
  });
});