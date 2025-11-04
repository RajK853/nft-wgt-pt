jest.mock('react-katex', () => ({
  BlockMath: jest.fn(() => <div data-testid="mock-block-math" />),
}));

jest.mock('@/components/point-system-table', () => ({
  PointSystemTable: jest.fn(() => <div data-testid="mock-point-system-table" />),
}));

jest.mock('@/lib/scoring-data', () => ({
  eventOutcomes: [], // Mock eventOutcomes as an empty array
}));

jest.mock('@/components/half-life-slider', () => ({
  HalfLifeSlider: jest.fn(({ initialHalfLife, onHalfLifeChange }) => (
    <div data-testid="mock-half-life-slider">
      <input
        type="range"
        data-testid="slider-input-half-life" // Changed data-testid
        value={initialHalfLife}
        onChange={(e) => onHalfLifeChange(Number(e.target.value))}
      />
      <span>Half-Life: {initialHalfLife} days</span>
    </div>
  )),
}));

jest.mock('@/components/original-score-slider', () => ({
  OriginalScoreSlider: jest.fn(({ initialOriginalScore, onOriginalScoreChange }) => (
    <div data-testid="mock-original-score-slider">
      <input
        type="range"
        data-testid="slider-input-original-score" // New data-testid
        value={initialOriginalScore}
        onChange={(e) => onOriginalScoreChange(Number(e.target.value))}
      />
      <span>Original Score: {initialOriginalScore.toFixed(1)}</span>
    </div>
  )),
}));

jest.mock('@/components/half-life-chart', () => ({
  HalfLifeChart: jest.fn(({ data }) => (
    <div data-testid="mock-half-life-chart">
      Chart Data Points: {data.length}
      {data.length > 0 && (
        <span>
          {' '}
          (First: {data[0].decayedScore.toFixed(2)}, Last:{' '}
          {data[data.length - 1].decayedScore.toFixed(2)})
        </span>
      )}
    </div>
  )),
}));

jest.mock('@/components/scoring-explanation', () => ({
  ScoringExplanation: () => <div data-testid="mock-scoring-explanation" />,
}));

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ScoringMethodPage from './page';

describe('ScoringMethodPage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  it('renders the page title and description', () => {
    render(<ScoringMethodPage />);
    expect(screen.getByText('Scoring Method')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Learn how player scores are calculated based on in-game events and our time-weighted system.'
      )
    ).toBeInTheDocument();
  });

  it('renders the HalfLifeSlider, OriginalScoreSlider and HalfLifeChart components', () => {
    render(<ScoringMethodPage />);
    expect(screen.getByTestId('mock-half-life-slider')).toBeInTheDocument();
    expect(screen.getByTestId('mock-original-score-slider')).toBeInTheDocument(); // New assertion
    expect(screen.getByTestId('mock-half-life-chart')).toBeInTheDocument();
  });

  it('updates chart data when half-life slider changes', () => {
    render(<ScoringMethodPage />);
    const halfLifeSliderInput = screen.getByTestId('slider-input-half-life'); // Changed data-testid
    const chart = screen.getByTestId('mock-half-life-chart');

    // Initial state check (originalScore = 1.5, halfLife = 30)
    expect(halfLifeSliderInput).toHaveValue('30');
    expect(chart).toHaveTextContent('Chart Data Points: 366');
    expect(chart).toHaveTextContent('First: 1.50, Last: 0.00');

    // Simulate half-life slider change to 60
    act(() => {
      fireEvent.change(halfLifeSliderInput, { target: { value: '60' } });
      jest.advanceTimersByTime(100); // Advance by debounce delay
    });

    // Check if the slider's displayed value updates
    expect(screen.getByText('Half-Life: 60 days')).toBeInTheDocument();

    // Check if the chart data updates (decayed score at 365 days with originalScore = 1.5, halfLife = 60)
    expect(chart).toHaveTextContent('First: 1.50, Last: 0.02');
  });

  it('updates chart data when original score slider changes', () => { // New test case
    render(<ScoringMethodPage />);
    const originalScoreSliderInput = screen.getByTestId('slider-input-original-score');
    const chart = screen.getByTestId('mock-half-life-chart');

    // Initial state check (originalScore = 1.5, halfLife = 30)
    expect(originalScoreSliderInput).toHaveValue('1.5');
    expect(chart).toHaveTextContent('First: 1.50, Last: 0.00');

    // Simulate original score slider change to 5.0
    act(() => {
      fireEvent.change(originalScoreSliderInput, { target: { value: '5.0' } });
      jest.advanceTimersByTime(100); // Advance by debounce delay
    });

    // Check if the slider's displayed value updates
    expect(screen.getByText('Original Score: 5.0')).toBeInTheDocument();

    // Check if the chart data updates (decayed score at 365 days with originalScore = 5.0, halfLife = 30)
    // S_decayed = 5.0 * (1/2)^(365/30) = 5.0 * 0.00020969... = 0.001048...
    expect(chart).toHaveTextContent('First: 5.00, Last: 0.00');
  });
});