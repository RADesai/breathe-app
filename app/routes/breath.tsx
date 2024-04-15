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

const highlightIndicator = (action: Breath, step: Breath) => {
  const actionSm = action.toLowerCase();
  const stepSm = step.toLowerCase();

  return (
    actionSm === stepSm
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
  const [durations, setDurations] = useState({
    [INHALE]: 3,
    [RETENTION]: 3,
    [EXHALE]: 3,
    [SUSPENSION]: 3,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const [breathCount, setBreathCount] = useState(0)

  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const breathTl = gsap.timeline({
        repeat: -1,
        smoothChildTiming: true,
        onRepeat: () => setBreathCount((prevCount) => prevCount + 1)
      });

      const boxes = gsap.timeline({
        repeat: -1
      });
      // todo: action vs animation timing
      breathTl
        .fromTo(
          '.box',
          {
            height: 5,
            backgroundColor: 'black',
            ease: 'power1.inOut',
            onStart: () => {
              console.log('onStart:INHALE');
              setAction(INHALE);
            }
          },
          {
            height: 320,
            duration: durations[INHALE],
            ease: 'power1.inOut',
            backgroundColor: '#87EEAB',
            onComplete: () => {
              console.log('onComplete:INHALE');
              setAction(RETENTION);
            }
          }
        )
        .to('.box', {
          height: 320,
          duration: durations[RETENTION],
          backgroundColor: '#87EEAB',
          ease: 'power1.inOut',
          onStart: () => {
            console.log('onStart:RETENTION');
            setAction(RETENTION);
          },
          onComplete: () => {
            console.log('onComplete:RETENTION');
            setAction(EXHALE);
          }
        })
        .fromTo(
          '.box',
          {
            height: 320,
            backgroundColor: '#87EEAB',
            ease: 'power1.inOut',
            onStart: () => {
              console.log('onStart:EXHALE');
              setAction(EXHALE);
            }
          },
          {
            height: 5,
            backgroundColor: 'black',
            duration: durations[EXHALE],
            ease: 'power1.inOut',
            onComplete: () => {
              console.log('onComplete:EXHALE');
              setAction(SUSPENSION);
            }
          }
        )
        .to('.box', {
          height: 5,
          duration: durations[SUSPENSION],
          ease: 'power1.inOut',
          onStart: () => {
            console.log('onStart:SUSPENSION');
            setAction(SUSPENSION);
          },
          onComplete: () => {
            console.log('onComplete:SUSPENSION');
            setAction(INHALE);
          }
        });

      boxes
        .fromTo(
          '.boxes',
          {
            opacity: 0,
            height: 0
          },
          {
            opacity: 1,
            height: 320,
            backgroundColor: '#87EEAB',
            duration: durations[INHALE] + durations[RETENTION] - 2,
            stagger: {
              each: 0.1,
              from: 'center',
              axis: 'x'
            },
            delay: 0
          }
        )
        .fromTo(
          '.boxes',
          {
            height: 320,
            opacity: 1
          },
          {
            height: 0,
            opacity: 0,
            duration: durations[EXHALE] + durations[SUSPENSION] - 2,
            stagger: {
              each: 0.1,
              from: 'center',
              axis: 'x'
            },
            delay: 0
          }
        );

      gsap.timeline().add(breathTl).add(boxes, 0);
    },
    {
      scope: container,
      dependencies: [
        durations[INHALE],
        durations[RETENTION],
        durations[EXHALE],
        durations[SUSPENSION],
      ],
    }
  );

  const updateBreath = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log('updateInhale:', { name, value });
    const newTime = Number(value);
    if (name === INHALE) {
      console.log('can we update inhale to:', value);
      if (newTime > durations[EXHALE]) {
        const msg = 'Inhale cannot be longer than Exhale';
        if (!errors.includes(msg)) {
          setErrors([...errors, msg]);
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
        if (!errors.includes(msg)) {
          setErrors([...errors, msg]);
        } else {
          setDurations((prevState) => {
            return {
              ...prevState,
              [name]: newTime
            }
          })
        }
      }
    }

    if (name === SUSPENSION) {
      console.log('can we update suspension to:', value);
      if (newTime > durations[EXHALE]) {
        const msg = 'Suspension cannot be longer than Exhale';
        if (!errors.includes(msg)) {
          setErrors([...errors, msg]);
        } else {
          setDurations((prevState) => {
            return {
              ...prevState,
              [name]: newTime
            }
          })
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

      <div className='carousel my-5 font-bold self-center tracking-widest uppercase flex flex-row justify-around'>
        {breaths.map((step) => (
          <div
            key={step}
            className={`mx-3 px-3 py-1 rounded ${
              highlightIndicator(action, step)
                ? 'font-bold underline bg-green-300'
                : 'opacity-75'
            }`}
          >
            {step}: {durations[action]}
          </div>
        ))}
      </div>

      <div ref={container} className='flex justify-center'>
        <div className='visuals flex flex-col'>
          <div className='flex flex-col self-center bg-slate-200 w-40 h-80'>
            <div className='flex justify-center'>
              {Array.from({ length: 20 }, (_, index) => (
                <div key={index} className={`boxes w-2`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='controls flex flex-col'>
        <div className='my-5 font-bold self-center tracking-widest uppercase text-xl text-green-800'>
          Controls
        </div>
        <div className='flex flex-col gap-1 self-center'>
          {errors && errors.map((error) => <Error key={error} error={error} />)}

          {breaths.map((duration) => (
            <Field key={duration} name={duration} updateBreath={updateBreath} />
          ))}
        </div>
      </div>

      <div className='self-center my-5 text-slate-500'>
        You have been here for {breathCount} breaths
      </div>
    </div>
  );
}
