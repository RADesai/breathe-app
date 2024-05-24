export const INHALE = 'inhale';
export const RETENTION = 'retention';
export const EXHALE = 'exhale';
export const SUSPENSION = 'suspension';
export const CYCLES = 'cycles';

export interface Duration {
  inhale: number;
  retention: number;
  exhale: number;
  suspension: number;
  cycles: number;
}

export type Breath =
  | typeof INHALE
  | typeof RETENTION
  | typeof EXHALE
  | typeof SUSPENSION
  | typeof CYCLES;

  export type Action = Omit<Breath, typeof CYCLES>

export const breaths: Breath[] = [INHALE, RETENTION, EXHALE, SUSPENSION];
export interface BreathInstruction {
  type: Breath;
  duration: number;
}
export type BreathSequence = BreathInstruction[];
