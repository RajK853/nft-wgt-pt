import { render, screen } from '@testing-library/react';
import { CircularLogo } from './circular-logo';
import React from 'react';

describe('CircularLogo', () => {
  it('renders the logo with correct src and alt attributes', () => {
    const src = '/nft-logo.jpg';
    const alt = 'NFT Logo';
    render(<CircularLogo src={src} alt={alt} />);

    const imgElement = screen.getByAltText(alt);
    expect(imgElement).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const src = '/nft-logo.jpg';
    const alt = 'NFT Logo';
    const customClass = 'custom-logo-class';
    render(<CircularLogo src={src} alt={alt} className={customClass} />);

    const divElement = screen.getByRole('img').closest('div');
    expect(divElement).toHaveClass(customClass);
  });

  it('renders with default styling classes', () => {
    const src = '/nft-logo.jpg';
    const alt = 'NFT Logo';
    render(<CircularLogo src={src} alt={alt} />);

    const divElement = screen.getByRole('img').closest('div');
    expect(divElement).toHaveClass('rounded-full', 'overflow-hidden', 'w-[150px]', 'h-[150px]', 'mb-4');
    const imgElement = screen.getByAltText(alt);
    expect(imgElement).toHaveClass('w-full', 'h-full', 'object-cover');
  });
});