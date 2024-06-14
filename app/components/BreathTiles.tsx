import {
  Action,
  Breath,
  breathSteps,
  Duration
} from '~/utils/types';

export const highlightIndicator = (action: Action, step: Breath) => {
  const actionSm = action.toLowerCase();
  const stepSm = step.toLowerCase();

  return actionSm === stepSm;
};

interface BreathsProps {
  action: Action;
  durations: Duration;
}

const BreathTiles = ({ action, durations }: BreathsProps) => {
  return (
    <div
      id='carousel'
      className='text-sm font-bold uppercase flex flex-col justify-between h-80 px-2'
    >
      {breathSteps.map((step) => (
        <div
          key={step}
          className={`rounded text-center p-2 ${
            highlightIndicator(action, step)
              ? 'text-white bg-[#c54c82] underline-offset-4'
              : 'opacity-50'
          }`}
        >
          <div className='underline'>{step}</div>
          <div className='text-xl'>{durations?.[step]}</div>
        </div>
      ))}
    </div>
  );
};

export default BreathTiles;
