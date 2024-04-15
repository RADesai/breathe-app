import { Link } from '@remix-run/react';
import { useRef, useState } from 'react';
import Field from '~/components/Field';
import useGSAP from '~/hooks/useGSAP';

export const INHALE = 'inhale';
export const RETENTION = 'retention';
export const EXHALE = 'exhale';
export const SUSPENSION = 'suspension';

export type Breath =
  | typeof INHALE
  | typeof RETENTION
  | typeof EXHALE
  | typeof SUSPENSION;

const breaths: Breath[] = [INHALE, RETENTION, EXHALE, SUSPENSION]
export interface BreathInstruction {
  type: Breath;
  duration: number;
}
export type BreathSequence = BreathInstruction[];

// export interface FormError {
//   type: Breath
//   reasons: string[]
// }
export type FormErrors = [
  { type: typeof INHALE, reasons: string[] },
  { type: typeof RETENTION, reasons: string[] },
  { type: typeof EXHALE, reasons: string[] },
  { type: typeof SUSPENSION, reasons: string[] }
]

const highlightIndicator = (action: Breath, step: Breath) => {
  const actionSm = action.toLowerCase();
  const stepSm = step.toLowerCase();

  return (
    actionSm === stepSm
  );
};


export default function Index() {
  const [action, setAction] = useState<Breath>(INHALE);
  const [durations, setDurations] = useState({
    [INHALE]: 5,
    [RETENTION]: 5,
    [EXHALE]: 5,
    [SUSPENSION]: 5,
  });
  const [errors, setErrors] = useState({
    [INHALE]: "",
    [RETENTION]: "",
    [EXHALE]: "",
    [SUSPENSION]: ""
  });

  const [breathCount, setBreathCount] = useState(0)

  const container = useRef<HTMLDivElement>(null);

  useGSAP({ setBreathCount, setAction, scope: container, durations });

  const updateBreath = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log('updateInhale:', { name, value });
    const newTime = Number(value);
    if (name === INHALE) {
      console.log('can we update inhale to:', value);
      if (newTime > durations[EXHALE]) {
        const msg = 'Inhale cannot be longer than Exhale';
        if (!errors[INHALE]) {
          setErrors((prevState) => {
            return {
              ...prevState,
              [INHALE]: msg
            };
          });
        } else {
          // setDurations((prevState) => {
          //   return {
          //     ...prevState,
          //     [name]: newTime
          //   }
          // })
        }
      }
    }

    if (name === RETENTION) {
      console.log('can we update retention to:', value);
      if (newTime > durations[INHALE]) {
        const msg = 'Retention cannot be longer than Inhale';
        if (!errors[RETENTION]) {
          setErrors((prevState) => {
            return {
              ...prevState,
              [RETENTION]: msg
            };
          });
        } else {
          // setDurations((prevState) => {
          //   return {
          //     ...prevState,
          //     [name]: newTime
          //   }
          // })
        }
      }
    }

    if (name === SUSPENSION) {
      console.log('can we update suspension to:', value);
      if (newTime > durations[EXHALE]) {
        const msg = 'Suspension cannot be longer than Exhale';
        if (!errors[SUSPENSION]) {
          setErrors((prevState) => {
            return {
              ...prevState,
              [SUSPENSION]: msg
            };
          });
        } else {
          // setDurations((prevState) => {
          //   return {
          //     ...prevState,
          //     [name]: newTime
          //   }
          // })
        }
      }
    }
  }

  return (
    <div className='flex justify-center flex-col'>
      <Link className='p-2 bg-blue-200 tracking-widest' to='/'>
        Home
      </Link>
      {/* Outlet */}

      <div className='text-sm carousel bg-slate-100 mb-5 py-2 font-bold justify-around uppercase flex flex-row w-full'>
        {breaths.map((step) => (
          <div
            key={step}
            className={`mx-3 px-3 py-1 rounded ${
              highlightIndicator(action, step)
                ? 'font-bold underline text-white bg-[#c54c82] underline-offset-4'
                : 'opacity-40'
            }`}
          >
            {step}: {durations[action]}
          </div>
        ))}
      </div>

      <div ref={container} className='flex justify-center'>
        <div className='visuals flex flex-col'>
          <div className='flex flex-col self-center bg-slate-100 w-40 h-80 border-2 border-[#c54c82] rounded'>
            <div className='flex justify-center'>
              {Array.from({ length: 80 }, (_, index) => (
                <div
                  key={index}
                  className={`boxes w-[2px] first-of-type:rounded-bl last-of-type:rounded-br`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='controls flex flex-col w-2/3 p-8 md:w-1/2 md:p-12 self-center'>
        <div className='my-5 font-bold self-center tracking-widest uppercase text-xl text-[#c54c82]'>
          Controls
        </div>
        <div className='self-center bg-slate-100 rounded p-2'>
          <div className='flex flex-col gap-1 self-center mb-5'>
            {breaths.map((breath) => (
              <Field
                key={breath}
                name={breath}
                updateBreath={updateBreath}
                error={errors[breath]}
              />
            ))}
          </div>

          <div className='text-slate-700 text-sm'>
            This breathwork animation gives you an option to select the length
            of breath that works for you in the moment and try 6-12-16 breaths
            of your choice.
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
            The above Ration is a SAMAMA practice of breathwork. Helps cultivate
            inner peace, balance and groundedness.
          </div>
        </div>
      </div>

      <div className='self-center my-5 text-slate-500'>
        You have been here for {breathCount} breaths
      </div>
    </div>
  );
}
