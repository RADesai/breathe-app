import {
  Action,
  Breath,
  breathSteps,
  Duration,
  EXHALE,
  INHALE,
  RETENTION,
  SUSPENSION
} from '~/utils/types';

export const isActiveStep = (action: Action, step: Breath) => {
  const actionSm = action.toLowerCase();
  const stepSm = step.toLowerCase();

  return actionSm === stepSm;
};

interface BreathsProps {
  action: Action;
  durations: Duration;
  seconds: number;
}

const getRemainingTime = (
  durations: Duration,
  step: Breath,
  seconds: number
) => {
  switch (step) {
    case INHALE:
      return durations[INHALE] - seconds;
    case RETENTION:
      return durations[INHALE] + durations[RETENTION] - seconds;
    case EXHALE:
      return (
        durations[INHALE] + durations[RETENTION] + durations[EXHALE] - seconds
      );
    case SUSPENSION:
      return (
        durations[INHALE] +
        durations[RETENTION] +
        durations[EXHALE] +
        durations[SUSPENSION] -
        seconds
      );
    default:
      return 0;
  }
};

const BreathTiles = ({ action, durations, seconds }: BreathsProps) => {
  return (
    <div
      id='carousel'
      className='font-bold uppercase flex flex-col justify-between h-80 px-2'
    >
      {breathSteps.map((step) => {
        const isActive = isActiveStep(action, step);
        return (
          <div
            key={step}
            className={`rounded text-center p-2 ${
              isActive
                ? 'text-white bg-purple underline-offset-4'
                : 'opacity-50'
            }`}
          >
            <div className='underline'>{step}</div>
            <div className='text-sm'>
              {isActive
                ? Math.round(getRemainingTime(durations, step, seconds))
                : durations?.[step]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BreathTiles;
