interface Outcome {
  description: string;
  points: number;
}

export const shooterOutcomes: Outcome[] = [
  { description: "Goal Scored (Open Play)", points: 10 },
  { description: "Goal Scored (Penalty)", points: 7 },
  { description: "Assist", points: 5 },
  { description: "Shot on Target", points: 2 },
  { description: "Pass Completion (per 10)", points: 1 },
  { description: "Tackle Won", points: 1 },
  { description: "Interception", points: 1 },
  { description: "Yellow Card", points: -2 },
  { description: "Red Card", points: -5 },
  { description: "Own Goal", points: -3 },
];

export const goalkeeperOutcomes: Outcome[] = [
  { description: "Clean Sheet", points: 8 },
  { description: "Save", points: 2 },
  { description: "Penalty Save", points: 10 },
  { description: "Goal Conceded", points: -3 },
  { description: "Yellow Card", points: -2 },
  { description: "Red Card", points: -5 },
];
