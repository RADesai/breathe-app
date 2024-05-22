export const INHALE = 'inhale';
export const RETENTION = 'retention';
export const EXHALE = 'exhale';
export const SUSPENSION = 'suspension';

export type Breath =
  | typeof INHALE
  | typeof RETENTION
  | typeof EXHALE
  | typeof SUSPENSION;

export const breaths: Breath[] = [INHALE, RETENTION, EXHALE, SUSPENSION];
export interface BreathInstruction {
  type: Breath;
  duration: number;
}
export type BreathSequence = BreathInstruction[];
