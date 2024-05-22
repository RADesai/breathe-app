import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { Duration } from '~/routes/breaths';
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
}

const Controls = (props: ControlsProps) => {
  const { resetAnimation } = props;
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
    console.log('updateBreath:', breath, event);
    const newValue = Number(event.target.value);

    if (breath === INHALE && newValue > settings[EXHALE]) {
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
    }

    if (breath === SUSPENSION && newValue > settings[EXHALE]) {
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
    <div className='controls text-slate-800 flex flex-col md:w-2/3 self-center'>
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
          className='w-full bg-slate-800 text-white rounded p-2 mb-5'
          onClick={() => {
            const path = breathObjectToString(settings);
            // todo: dont navigate if same settings
            // ! stop/re-render animation since more are starting
            resetAnimation();
            console.log(`navigate to: /breaths/${path}`);
            navigate(`/breaths/${path}`);
          }}
        >
          Update
        </button>

        <ControlsInformation />
      </div>
    </div>
  );
};

export default Controls;
