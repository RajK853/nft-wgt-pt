import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HalfLifeSlider } from './half-life-slider';

// Mock the shadcn/ui Slider component to use a simple input type="range" for testing
jest.mock('@/components/ui/slider', () => ({
  Slider: jest.fn(({ onValueChange, value, ...props }) => (
    <input
      type="range"
      data-testid="mock-slider"
      value={value[0]}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      {...props}
    />
  )),
}));

describe('HalfLifeSlider', () => {
  it('renders correctly with initial half-life', () => {
    render(<HalfLifeSlider initialHalfLife={30} onHalfLifeChange={() => {}} />);
    expect(screen.getByText('Half-Life: 30 days')).toBeInTheDocument();
    expect(screen.getByTestId('mock-slider')).toHaveAttribute('value', '30');
  });

  it('calls onHalfLifeChange when slider value changes', () => {
    const handleChange = jest.fn();
    render(<HalfLifeSlider initialHalfLife={30} onHalfLifeChange={handleChange} />);
    const mockSlider = screen.getByTestId('mock-slider');

    fireEvent.change(mockSlider, { target: { value: '45' } });
    expect(handleChange).toHaveBeenCalledWith(45);
    expect(screen.getByText('Half-Life: 45 days')).toBeInTheDocument();
  });

  it('restricts half-life to the defined range (1-90)', () => {
    render(<HalfLifeSlider initialHalfLife={1} onHalfLifeChange={() => {}} />);
    const mockSlider = screen.getByTestId('mock-slider');

    expect(mockSlider).toHaveAttribute('min', '1');
    expect(mockSlider).toHaveAttribute('max', '90');
  });
});