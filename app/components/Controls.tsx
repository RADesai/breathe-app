import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { Duration } from '~/routes/breath';
import {
    Breath,
    breaths,
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
    [SUSPENSION]: 's'
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
  <div className='text-sm'>
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

  return <div className='text-sm text-red-700 '>{error}</div>;
};

interface ControlsProps {
  resetAnimation: () => void;
  breathCount: number;
}

const Controls = (props: ControlsProps) => {
  const { resetAnimation, breathCount } = props;
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    [INHALE]: 5,
    [RETENTION]: 5,
    [EXHALE]: 5,
    [SUSPENSION]: 5
  });
  const [errors, setErrors] = useState({
    [INHALE]: '',
    [RETENTION]: '',
    [EXHALE]: '',
    [SUSPENSION]: ''
  });

  const updateBreath = (
    event: React.ChangeEvent<HTMLInputElement>,
    breath: Breath
  ) => {
    const newValue = Number(event.target.value);

    if (breath === INHALE && newValue > settings[EXHALE]) {
      setErrors((prevState) => ({
        ...prevState,
        [INHALE]: 'Inhale cannot be longer than Exhale'
      }));
    } else if (breath === INHALE && newValue <= settings[EXHALE]) {
      setErrors((prevState) => ({ ...prevState, [INHALE]: '' }));
    } else if (breath === EXHALE && newValue > settings[INHALE]) {
      setErrors((prevState) => ({ ...prevState, [INHALE]: '' }));
    } else if (breath === EXHALE && newValue <= settings[INHALE]) {
      setErrors((prevState) => ({
        ...prevState,
        [INHALE]: 'Inhale cannot be longer than Exhale'
      }));
    }

    if (breath === RETENTION && newValue > settings[INHALE]) {
      setErrors((prevState) => ({
        ...prevState,
        [RETENTION]: 'Retention cannot be longer than Inhale'
      }));
    } else if (breath === RETENTION && newValue <= settings[INHALE]) {
      setErrors((prevState) => ({ ...prevState, [RETENTION]: '' }));
    } else if (breath === INHALE && newValue > settings[RETENTION]) {
      setErrors((prevState) => ({ ...prevState, [RETENTION]: '' }));
    } else if (breath === INHALE && newValue <= settings[RETENTION]) {
      setErrors((prevState) => ({
        ...prevState,
        [RETENTION]: 'Retention cannot be longer than Inhale'
      }));
    }

    if (breath === SUSPENSION && newValue > settings[EXHALE]) {
      setErrors((prevState) => ({
        ...prevState,
        [SUSPENSION]: 'Suspension cannot be longer than Exhale'
      }));
    } else if (breath === SUSPENSION && newValue <= settings[EXHALE]) {
      setErrors((prevState) => ({ ...prevState, [SUSPENSION]: '' }));
    } else if (breath === EXHALE && newValue > settings[SUSPENSION]) {
      setErrors((prevState) => ({ ...prevState, [SUSPENSION]: '' }));
    } else if (breath === EXHALE && newValue <= settings[SUSPENSION]) {
      setErrors((prevState) => ({
        ...prevState,
        [SUSPENSION]: 'Suspension cannot be longer than Exhale'
      }));
    }

    setSettings((prev) => ({
      ...prev,
      [breath]: newValue
    }));
  };

  return (
    <div className='controls text-slate-800 flex flex-col md:w-2/3 self-center justify-center'>
      <div className='mb-5 font-bold self-center tracking-widest uppercase text-xl'>
        Controls
      </div>
      <div className='self-center bg-slate-100 rounded p-3'>
        <div className='flex flex-col gap-1 self-center mb-5'>
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
                      ? ' text-red-700 border-red-700'
                      : 'border-slate-200'
                  }`}
                  name={breath}
                  type='number'
                  min={1}
                />
              </div>
              {errors[breath] && (
                <Error key={errors[breath]} error={errors[breath]} />
              )}
            </div>
          ))}
        </div>
        <button
          className='rounded p-2 my-4 w-full tracking-widest flex items-center justify-center bg-[#94E4FF] mb-5'
          onClick={() => {
            const path = breathObjectToString(settings);
            // todo: use redirect() from form action instead of navigate() - https://remix.run/docs/en/main/utils/redirect
            // todo: dont navigate if same settings
            resetAnimation();
            console.log(`navigate to: /breath/${path}`);
            navigate(`/breath/${path}`);
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

        <ControlsInformation />

        <div className='self-center my-5 text-slate-500'>
          You have been here for {breathCount} breaths
        </div>
      </div>
    </div>
  );
};

export default Controls;
