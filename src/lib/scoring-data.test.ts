import { eventOutcomes, EventOutcome } from './scoring-data';

describe('EventOutcome Interface', () => {
  it('should correctly define the structure of an EventOutcome object', () => {
    const testOutcome: EventOutcome = {
      event: 'Test Event',
      shooterPoints: 10.0,
      goalkeeperPoints: -5.0,
    };

    expect(testOutcome).toHaveProperty('event');
    expect(typeof testOutcome.event).toBe('string');
    expect(testOutcome).toHaveProperty('shooterPoints');
    expect(typeof testOutcome.shooterPoints).toBe('number');
    expect(testOutcome).toHaveProperty('goalkeeperPoints');
    expect(typeof testOutcome.goalkeeperPoints).toBe('number');
  });
});

describe('eventOutcomes Array', () => {
  it('should be an array of EventOutcome objects', () => {
    expect(Array.isArray(eventOutcomes)).toBe(true);
    eventOutcomes.forEach((outcome) => {
      expect(outcome).toHaveProperty('event');
      expect(typeof outcome.event).toBe('string');
      expect(outcome).toHaveProperty('shooterPoints');
      expect(typeof outcome.shooterPoints).toBe('number');
      expect(outcome).toHaveProperty('goalkeeperPoints');
      expect(typeof outcome.goalkeeperPoints).toBe('number');
    });
  });

  it('should contain specific scoring data for Goal, Saved, and Out events', () => {
    const goalOutcome = eventOutcomes.find((outcome) => outcome.event === 'Goal');
    expect(goalOutcome).toEqual({ event: 'Goal', shooterPoints: 1.5, goalkeeperPoints: -1.0 });

    const savedOutcome = eventOutcomes.find((outcome) => outcome.event === 'Saved');
    expect(savedOutcome).toEqual({ event: 'Saved', shooterPoints: 0.0, goalkeeperPoints: 1.5 });

    const outOutcome = eventOutcomes.find((outcome) => outcome.event === 'Out');
    expect(outOutcome).toEqual({ event: 'Out', shooterPoints: -1.0, goalkeeperPoints: 0.0 });
  });

  it('should not contain duplicate event names', () => {
    const eventNames = eventOutcomes.map((outcome) => outcome.event);
    const uniqueEventNames = new Set(eventNames);
    expect(eventNames.length).toBe(uniqueEventNames.size);
  });
});
