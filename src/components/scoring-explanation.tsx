import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

interface ScoringExplanationProps {
  title: string;
  description: string;
  example: string;
  formulaTitle: string;
  formula: string;
  formulaExplanation: string;
}

export const ScoringExplanation: React.FC<ScoringExplanationProps> = ({
  title,
  description,
  example,
  formulaTitle,
  formula,
  formulaExplanation,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="mb-4">{description}</p>
            <p>{example}</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{formulaTitle}</h3>
            <BlockMath math={formula} data-testid="react-katex" />
            <p className="text-sm text-muted-foreground mt-2">{formulaExplanation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
