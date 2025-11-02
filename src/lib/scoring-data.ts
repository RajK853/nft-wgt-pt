/**
 * Defines the structure for an event outcome in the scoring system.
 */
export interface EventOutcome {
  /** The name of the event (e.g., "Goal", "Saved", "Out"). */
  event: string;
  /** The points awarded to a shooter for this event. */
  shooterPoints: number;
  /** The points awarded to a goalkeeper for this event. */
  goalkeeperPoints: number;
}

/**
 * An array of event outcomes, detailing points awarded to shooters and goalkeepers for each event.
 */
export const eventOutcomes: EventOutcome[] = [
  { event: "Goal", shooterPoints: 1.5, goalkeeperPoints: -1.0 },
  { event: "Saved", shooterPoints: 0.0, goalkeeperPoints: 1.5 },
  { event: "Out", shooterPoints: -1.0, goalkeeperPoints: 0.0 },
];
