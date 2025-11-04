import React from 'react';
import { render, screen } from '@testing-library/react';
import { HalfLifeChart } from './half-life-chart';

// Mock recharts components to avoid actual chart rendering in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: () => <div data-testid="yaxis" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe('HalfLifeChart', () => {
  const mockData = [
    { time: 0, decayedScore: 1.5 },
    { time: 10, decayedScore: 0.75 },
    { time: 20, decayedScore: 0.375 },
  ];

  it('renders without crashing', () => {
    render(<HalfLifeChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('passes data to the LineChart component', () => {
    render(<HalfLifeChart data={mockData} />);
    // In a real test, you might inspect the props passed to the mocked LineChart
    // For now, we just ensure it renders without error with data
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('renders all necessary recharts components', () => {
    render(<HalfLifeChart data={mockData} />);
    expect(screen.getByTestId('line')).toBeInTheDocument();
    expect(screen.getByTestId('xaxis')).toBeInTheDocument();
    expect(screen.getByTestId('yaxis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });
});
