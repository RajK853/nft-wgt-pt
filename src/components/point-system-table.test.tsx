import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PointSystemTable } from './point-system-table';
import { EventOutcome } from '@/lib/scoring-data';

describe('PointSystemTable', () => {
  const mockOutcomes: EventOutcome[] = [
    { event: 'Goal', shooterPoints: 1.5, goalkeeperPoints: -1.0 },
    { event: 'Saved', shooterPoints: 0.0, goalkeeperPoints: 1.5 },
    { event: 'Out', shooterPoints: -1.0, goalkeeperPoints: 0.0 },
    { event: 'Assist', shooterPoints: 1.0, goalkeeperPoints: 0.0 },
  ];

  it('renders the table with correct headers', () => {
    render(<PointSystemTable outcomes={mockOutcomes} />);

    expect(screen.getByRole('columnheader', { name: /event/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /shooter points/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /goalkeeper points/i })).toBeInTheDocument();
  });

  it('renders the correct number of rows based on outcomes', () => {
    render(<PointSystemTable outcomes={mockOutcomes} />);
    const rows = screen.getAllByRole('row');
    // +1 for header row
    expect(rows).toHaveLength(mockOutcomes.length + 1);
  });

  it('displays correct data for each event outcome', () => {
    const { container } = render(<PointSystemTable outcomes={mockOutcomes} />);
    const tbody = container.querySelector('tbody');
    if (!tbody) throw new Error('tbody not found');

    mockOutcomes.forEach((outcome) => {
      const row = within(tbody).getByRole('row', { name: new RegExp(outcome.event, 'i') });
      expect(within(row).getByText(outcome.event)).toBeInTheDocument();
      expect(within(row).getByText(outcome.shooterPoints.toString())).toBeInTheDocument();
      expect(within(row).getByText(outcome.goalkeeperPoints.toString())).toBeInTheDocument();
    });
  });

  it('applies correct styling for positive, negative, and zero points', () => {
    const { container } = render(<PointSystemTable outcomes={mockOutcomes} />);
    const tbody = container.querySelector('tbody');
    if (!tbody) throw new Error('tbody not found');

    // Goal: Shooter (positive), Goalkeeper (negative)
    const goalRow = within(tbody).getByRole('row', { name: /Goal/i });
    const goalShooterPoints = within(goalRow).getByText('1.5');
    expect(goalShooterPoints).toHaveClass('text-green-600');
    const goalGoalkeeperPoints = within(goalRow).getByText('-1');
    expect(goalGoalkeeperPoints).toHaveClass('text-red-600');

    // Saved: Shooter (zero), Goalkeeper (positive)
    const savedRow = within(tbody).getByRole('row', { name: /Saved/i });
    const savedShooterPoints = within(savedRow).getByText('0');
    expect(savedShooterPoints).not.toHaveClass('text-green-600');
    expect(savedShooterPoints).not.toHaveClass('text-red-600');
    const savedGoalkeeperPoints = within(savedRow).getByText('1.5');
    expect(savedGoalkeeperPoints).toHaveClass('text-green-600');

    // Out: Shooter (negative), Goalkeeper (zero)
    const outRow = within(tbody).getByRole('row', { name: /Out/i });
    const outShooterPoints = within(outRow).getByText('-1');
    expect(outShooterPoints).toHaveClass('text-red-600');
    const outGoalkeeperPoints = within(outRow).getByText('0');
    expect(outGoalkeeperPoints).not.toHaveClass('text-green-600');
    expect(outGoalkeeperPoints).not.toHaveClass('text-red-600');

    // Assist: Shooter (positive), Goalkeeper (zero)
    const assistRow = within(tbody).getByRole('row', { name: /Assist/i });
    const assistShooterPoints = within(assistRow).getByText('1');
    expect(assistShooterPoints).toHaveClass('text-green-600');
    const assistGoalkeeperPoints = within(assistRow).getByText('0');
    expect(assistGoalkeeperPoints).not.toHaveClass('text-green-600');
    expect(assistGoalkeeperPoints).not.toHaveClass('text-red-600');
  });

  it('renders an empty state or no rows when outcomes array is empty', () => {
    render(<PointSystemTable outcomes={[]} />);
    const rows = screen.getAllByRole('row');
    // Only header row should be present
    expect(rows).toHaveLength(1);
    expect(screen.queryByRole('cell')).not.toBeInTheDocument();
  });
});
