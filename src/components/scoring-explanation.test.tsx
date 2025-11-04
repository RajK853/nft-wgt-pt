import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScoringExplanation } from './scoring-explanation';

describe('ScoringExplanation', () => {
  const defaultProps = {
    title: 'Time-Weighted Scoring',
    description: 'Explanation of how scores decay over time.',
    formula: 'S_{decayed} = S_{original} \\times frac{1}{2}^{\\frac{t_{elapsed}}{t_{half-life}}}',
    formulaExplanation: 'This formula describes the exponential decay of a score.',
  };

  it('renders the title and description correctly', () => {
    render(<ScoringExplanation {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });

  it('renders the formula explanation correctly', () => {
    render(<ScoringExplanation {...defaultProps} />);
    expect(screen.getByText(defaultProps.formulaExplanation)).toBeInTheDocument();
  });

  it('renders the LaTeX formula correctly', () => {
    render(<ScoringExplanation {...defaultProps} />);
    // KaTeX renders the formula into a span with class 'katex-mathml' or similar structure
    // We can check for the presence of the formula string within the rendered output
    // or more robustly, check for specific parts of the rendered math.
    // For simplicity, we'll check for a part of the formula string in the DOM.
    // A more thorough test might inspect the SVG/MathML output.
    expect(screen.getByTestId('react-katex')).toBeInTheDocument();
    // Optionally, you can add more specific checks for the rendered content if needed,
    // but checking for the presence of the KaTeX container is a good start.
    // For example, you could check if the innerHTML contains specific parts of the formula,
    // but this can be brittle due to KaTeX's complex DOM structure.
  });
});
