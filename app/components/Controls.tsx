import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  Breath,
  breaths,
  CYCLES,
  Duration,
  EXHALE,
  INHALE,
  RETENTION,
  SUSPENSION
} from '~/utils/types';

function breathObjectToString(settings: Duration) {
  const breathParts = {
    [INHALE]: 'i',
    [RETENTION]: 'r',
    [EXHALE]: 'e',
    [SUSPENSION]: 's',
    [CYCLES]: 'c'
  };

  let result = '';
  for (const breath in settings) {
    const letter = breathParts[breath]; // Get the letter corresponding to the breath
    const value = settings[breath];

    if (letter && !isNaN(value)) {
      result += letter + value;
    } else {
      // Handle errors: invalid breath in the object
      console.error(`Invalid breath: ${breath}`);
    }
  }
  return result;
}

const ControlsInformation = () => (
  <div className='text-sm max-h-72 overflow-scroll px-2 py-20'>
    This breathwork animation gives you an option to select the length of breath
    that works for you in the moment and try 6-12-16 breaths of your choice.
    <br />
    <br />
    In = Inhale ( through the nose)
    <br />R = Hold after Inhale
    <br />
    Ex = Exhale (through the nose mouth closed)
    <br />
    Exhale = 4 ( exhale needs to be equal to or greater than inhale)
    <br />S = Hold after Exhale
    <br />
    <br />
    The above Ration is a SAMAMA practice of breathwork. Helps cultivate inner
    peace, balance and groundedness.
  </div>
);

const toTitleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export interface ErrorProps {
  error: string;
}
const Error = (props: ErrorProps) => {
  const { error } = props;

  return <div className='text-sm text-red'>{error}</div>;
};

interface ControlsProps {
  resetAnimation: () => void;
  breathCount: number;
}

// todo: form validate with fields, not current
const Controls = (props: ControlsProps) => {
  const { resetAnimation, breathCount } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const [settings, setSettings] = useState({
    [INHALE]: 5,
    [RETENTION]: 5,
    [EXHALE]: 5,
    [SUSPENSION]: 5,
    [CYCLES]: 10
  });
  const [errors, setErrors] = useState({
    [INHALE]: '',
    [RETENTION]: '',
    [EXHALE]: '',
    [SUSPENSION]: '',
    [CYCLES]: ''
  });

  const somethingsWrong =
    errors[INHALE] ||
    errors[RETENTION] ||
    errors[EXHALE] ||
    errors[SUSPENSION] ||
    Number(errors[CYCLES])! > 0;

  const updateBreath = (
    event: React.ChangeEvent<HTMLInputElement>,
    breath: Breath
  ) => {
    const newValue = Number(event.target.value);

    if (breath === INHALE && newValue > settings[EXHALE]) {
      setErrors((prevState) => ({
        ...prevState,
        [INHALE]: 'Inhale should not be longer than Exhale'
      }));
    } else if (breath === INHALE && newValue <= settings[EXHALE]) {
      setErrors((prevState) => ({ ...prevState, [INHALE]: '' }));
    } else if (breath === EXHALE && newValue >= settings[INHALE]) {
      setErrors((prevState) => ({ ...prevState, [INHALE]: '' }));
    } else if (breath === EXHALE && newValue < settings[INHALE]) {
      setErrors((prevState) => ({
        ...prevState,
        [INHALE]: 'Inhale should not be longer than Exhale'
      }));
    }

    if (breath === RETENTION && newValue > settings[INHALE]) {
      setErrors((prevState) => ({
        ...prevState,
        [RETENTION]: 'Retention should not be longer than Inhale'
      }));
    } else if (breath === RETENTION && newValue <= settings[INHALE]) {
      setErrors((prevState) => ({ ...prevState, [RETENTION]: '' }));
    } else if (breath === INHALE && newValue >= settings[RETENTION]) {
      setErrors((prevState) => ({ ...prevState, [RETENTION]: '' }));
    } else if (breath === INHALE && newValue < settings[RETENTION]) {
      setErrors((prevState) => ({
        ...prevState,
        [RETENTION]: 'Retention should not be longer than Inhale'
      }));
    }

    if (breath === SUSPENSION && newValue > settings[EXHALE]) {
      setErrors((prevState) => ({
        ...prevState,
        [SUSPENSION]: 'Suspension should not be longer than Exhale'
      }));
    } else if (breath === SUSPENSION && newValue <= settings[EXHALE]) {
      setErrors((prevState) => ({ ...prevState, [SUSPENSION]: '' }));
    } else if (breath === EXHALE && newValue >= settings[SUSPENSION]) {
      setErrors((prevState) => ({ ...prevState, [SUSPENSION]: '' }));
    } else if (breath === EXHALE && newValue < settings[SUSPENSION]) {
      setErrors((prevState) => ({
        ...prevState,
        [SUSPENSION]: 'Suspension should not be longer than Exhale'
      }));
    }

    setSettings((prev) => ({
      ...prev,
      [breath]: newValue
    }));
  };

  return (
    <div className='controls bg-dark bg-opacity-5 flex flex-col md:w-2/3 self-center justify-center mb-10'>
      <div className='py-2 font-bold self-center tracking-widest uppercase text-xl'>
        Controls
      </div>

      <div className='flex rounded'>
        <div className='flex flex-col gap-4 self-center px-4 min-w-60'>
          {breaths.map((breath) => (
            <div key={breath} className='flex flex-col'>
              <div className='flex justify-between items-center pb-1'>
                <label
                  className='underline underline-offset-2'
                  htmlFor={breath}
                >
                  {toTitleCase(breath)}:
                </label>
                <input
                  onChange={(e) => updateBreath(e, breath)}
                  value={settings[breath]}
                  className={`rounded w-14 text-lg ml-3 px-1 border ${
                    errors[breath]
                      ? ' text-red border-red'
                      : 'border-slate-200'
                  }`}
                  name={breath}
                  type='number'
                  min={1}
                  step={1}
                />
              </div>
            </div>
          ))}
          <div className='errors flex flex-col gap-1 text-sm font-semibold'>
            {Object.entries(errors)
              .filter(([, value]) => value !== '')
              .map(([key, error]) => (
                <Error key={key} error={error} />
              ))}
          </div>
          <button
            disabled={!!somethingsWrong}
            className='rounded p-2 w-full tracking-widest flex items-center justify-center bg-orange mb-5 shadow hover:shadow-orange disabled:opacity-50 disabled:shadow-none'
            onClick={() => {
              const path = breathObjectToString(settings);
              // todo: use redirect() from form action instead of navigate() - https://remix.run/docs/en/main/utils/redirect
              // todo: dont navigate if same settings
              resetAnimation(); // TODO: this isn't resetting the animation...
              console.log(`navigate to: /breath/${path}`);
              const currentPath = location.pathname;
              if (currentPath === `/breath/${path}`) {
                // todo: disable button for this
                console.log('not gonna redirect to current page');
              } else navigate(`/breath/${path}`);
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='w-8 h-8 mr-4 opacity-75'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3'
              />
            </svg>
            Update
          </button>
        </div>

        <div className='flex flex-col'>
          <ControlsInformation />

          <div className='self-center my-5 text-slate-500 p-1'>
            You have been here for {breathCount} breaths
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
