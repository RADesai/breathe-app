import {
  Action,
  Breath,
  breathSteps,
  Duration,
  EXHALE,
  INHALE,
  RETENTION,
  SUSPENSION,
} from "~/utils/types";

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

export const formatTime = (time: number) => {
  return Math.round(time * 10) / 10;
};

const getRemainingTime = (
  durations: Duration,
  step: Breath,
  seconds: number,
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
      id="carousel"
      className="flex h-80 flex-col justify-between px-2 font-bold uppercase"
    >
      {breathSteps.map((step) => {
        const isActive = isActiveStep(action, step);
        return (
          <div
            key={step}
            className={`rounded p-2 text-center ${
              isActive ? "bg-pink text-white underline-offset-4" : "opacity-50"
            }`}
          >
            <div className="underline">{step === RETENTION || step === SUSPENSION ? 'hold' : step}</div>
            <div className="text-sm">
              {isActive
                ? formatTime(getRemainingTime(durations, step, seconds)).toFixed(1)
                : durations?.[step]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BreathTiles;
