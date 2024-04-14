import { useGSAP } from '@gsap/react';
import { Link } from '@remix-run/react';
import gsap from 'gsap/dist/gsap';
import TextPlugin from 'gsap/dist/TextPlugin';
import { useRef, useState } from 'react';
import Field from '~/components/Field';

const INHALE = 'inhale';
const RETENTION = 'retention';
const EXHALE = 'exhale';
const SUSPENSION = 'suspension';

export type Breath =
  | typeof INHALE
  | typeof RETENTION
  | typeof EXHALE
  | typeof SUSPENSION;

const breaths = [INHALE, RETENTION, EXHALE, SUSPENSION]
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

if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

const indicators: (Breath | 'hold')[] = [INHALE, 'hold', EXHALE];

const highlightIndicator = (action: Breath, step: Breath | 'hold') => {
  const actionSm = action.toLowerCase();
  const stepSm = step.toLowerCase();

  return (
    actionSm === stepSm ||
    ((actionSm === RETENTION || actionSm === SUSPENSION) && step === 'hold')
  );
};

export interface ErrorProps {
  error: string
}

const Error = (props: ErrorProps) => {
  const { error } = props;

  return (
    <div className='text-sm text-red-700 font-bold'>{error}</div>
  )
}

export default function Index() {
  const [action, setAction] = useState<Breath>(INHALE);
  const [durations] = useState({
    INHALE: 5,
    RETENTION: 5,
    EXHALE: 5,
    SUSPENSION: 5,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const breathTl = gsap.timeline({ repeat: -1, smoothChildTiming: true });
      const wordsTl = gsap.timeline({ repeat: -1 });

      breathTl
        .fromTo(
          '.box',
          {
            height: 5,
            backgroundColor: 'black',
            ease: 'ease',
            onStart: () => {
              console.log('onStart:INHALE');
              setAction(INHALE);
            },
          },
          {
            height: 320,
            duration: durations.INHALE,
            ease: 'ease',
            backgroundColor: 'green',
            onComplete: () => {
              console.log('onComplete:INHALE -> retention');
              setAction(RETENTION);
            },
          }
        )
        .to('.box', {
          height: 320,
          duration: durations.RETENTION,
          backgroundColor: 'green',
          ease: 'ease',
          onStart: () => {
            console.log('onStart:HOLD:RETENTION');
            setAction(RETENTION);
          },
          onComplete: () => {
            console.log('onComplete:HOLD:RETENTION -> exhale');
            setAction(EXHALE);
          },
        })
        .fromTo(
          '.box',
          {
            height: 320,
            backgroundColor: 'green',
            ease: 'ease',
            onStart: () => {
              console.log('onStart:EXHALE');
              setAction(EXHALE);
            },
          },
          {
            height: 5,
            backgroundColor: 'black',
            duration: durations.EXHALE,
            ease: 'ease',
            onComplete: () => {
              console.log('onComplete:EXHALE -> suspension');
              setAction(SUSPENSION);
            },
          }
        )
        .to('.box', {
          height: 5,
          duration: durations.SUSPENSION,
          ease: 'ease',
          onStart: () => {
            console.log('onStart:HOLD:SUSPENSION');
            setAction(SUSPENSION);
          },
          onComplete: () => {
            console.log('onComplete:HOLD:SUSPENSION -> inhale');
            setAction(INHALE);
          },
        });

      wordsTl
        .fromTo(
          '.words',
          {
            opacity: 0.25,
            text: { value: 'Inhale' }
          },
          {
            duration: durations.INHALE,
            opacity: 1,
            text: { value: 'Inhale', delimiter: ' ' }
          }
        )
        .to('.words', {
          duration: durations.RETENTION,
          text: { value: 'Hold', delimiter: ' ' }
        })
        .fromTo(
          '.words',
          {
            opacity: 1,
            text: { value: 'Exhale', },
          },
          {
            duration: durations.EXHALE,
            opacity: 0.25,
            text: { value: 'Exhale', delimiter: ' ' }
          }
        )
        .to('.words', {
          duration: durations.SUSPENSION,
          opacity: 0.25,
          text: { value: 'Hold', delimiter: ' ' }
        });

      gsap.timeline().add(breathTl).add(wordsTl, 0);
    },
    {
      scope: container,
      dependencies: [
        durations.INHALE,
        durations.RETENTION,
        durations.EXHALE,
        durations.SUSPENSION,
      ],
    }
  );

  const updateBreath = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log('updateInhale:', { name, value });
    const newTime = Number(value);
    if (name === INHALE) {
      console.log('can we update inhale to:', value);
      if (newTime > durations.EXHALE) {
        const msg = 'Inhale cannot be longer than Exhale';
        if (!errors.includes(msg)) {
          setErrors([...errors, msg]);
        }
      }
    }

    if (name === RETENTION) {
      console.log('can we update retention to:', value);
      if (newTime > durations.INHALE) {
        const msg = 'Retention cannot be longer than Inhale';
        if (!errors.includes(msg)) {
          setErrors([...errors, msg]);
        }
      }
    }

    if (name === SUSPENSION) {
      console.log('can we update suspension to:', value);
      if (newTime > durations.EXHALE) {
        const msg = 'Suspension cannot be longer than Exhale';
        if (!errors.includes(msg)) {
          setErrors([...errors, msg]);
        }
      }
    }
  }

  return (
    <div className='flex justify-center flex-col'>
      <Link className='p-2 bg-blue-200 tracking-widest' to='/'>
        Home
      </Link>
      <div className='w-50 bg-slate-200'>
        <div className='carousel my-5 font-bold self-center tracking-widest uppercase flex flex-row justify-around'>
          {indicators.map((step) => (
            <div
              key={step}
              className={`mx-3 bg-green-300 px-2 ${
                highlightIndicator(action, step) ? 'font-bold underline' : 'opacity-30'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      <div className='visuals flex flex-col'>
        <div className='words my-5 font-bold self-center tracking-widest uppercase text-xl text-green-800' />
        <div className='flex flex-col h-80 w-fit self-center bg-slate-200 rounded'>
          <div ref={container} className='flex flex-row justify-center'>
            <div className={`box w-44 rounded`} />
          </div>
        </div>
      </div>

      <div className='controls flex flex-col'>
        <div className='my-5 font-bold self-center tracking-widest uppercase text-xl text-green-800'>
          Controls
        </div>
        <div className='flex flex-col gap-2 self-center'>
          {breaths.map((duration) => (
            <Field key={duration} name={duration} updateBreath={updateBreath} />
          ))}
          {errors && errors.map((error) => <Error key={error} error={error} />)}
        </div>
      </div>
    </div>
  );
}
