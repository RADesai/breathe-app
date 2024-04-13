
import { useGSAP } from '@gsap/react';
import { Link } from "@remix-run/react";
import gsap from 'gsap/dist/gsap';
import { useRef, useState } from "react";

const INHALE = 'inhale';
const RETENTION = 'retention';
const EXHALE = 'exhale';
const SUSPENSION = 'suspension';

export type Breath =
  typeof INHALE | typeof RETENTION | typeof EXHALE | typeof SUSPENSION;
export interface BreathInstruction {
  type: Breath
  duration: number;
}
export type BreathSequence = BreathInstruction[];

// const styles = {
//   [INHALE]: `bg-orange-300`,
//   [RETENTION]: `bg-red-500`,
//   [EXHALE]: `bg-orange-300 text-blue-300`,
//   [SUSPENSION]: `bg-red-500 p-0`,
// };

// const getStyle = (action: Breath) => {
//   return styles[action];
// };

export default function Index() {
  const [durations, setDurations] = useState({
    INHALE: 5,
    RETENTION: 5,
    EXHALE: 5,
    SUSPENSION: 5
  });
  const [action, setAction] = useState<Breath>(INHALE)

  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1, smoothChildTiming: true });

      tl.fromTo(
        '.box',
        {
          height: 1,
          backgroundColor: '#452c63',
        },
        {
          height: 240,
          duration: durations.INHALE,
          ease: 'power1.out',
          backgroundColor: '#89CFF0',
          onComplete: () => {
            console.log('onComplete:INHALE -> retention');
            setAction(RETENTION);
          },
        }
      )
        .to('.box', {
          height: 240,
          duration: durations.RETENTION,
          backgroundColor: '#89CFF0',
          onComplete: () => {
            console.log('onComplete:HOLD:RETENTION -> exhale');
            setAction(EXHALE);
          },
        })
        .fromTo(
          '.box',
          {
            height: 240,
            backgroundColor: '#89CFF0',
          },
          {
            height: 1,
            backgroundColor: '#452c63',
            duration: durations.EXHALE,
            ease: 'power1.out',
            onComplete: () => {
              console.log('onComplete:EXHALE -> suspension');
              setAction(SUSPENSION);
            },
          }
        )
        .to('.box', {
          height: 1,
          duration: durations.SUSPENSION,
          onComplete: () => {
            console.log('onComplete:HOLD:SUSPENSION -> inhale');
            setAction(INHALE);
          },
        });
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

  return (
    <div className='flex justify-center flex-col'>
      <Link className='p-2 bg-blue-200 tracking-widest' to='/'>
        Home
      </Link>

      <div className='my-5 font-bold self-center tracking-widest uppercase'>
        {action}
      </div>

      <div className='flex flex-col h-60 bg-slate-200 w-fit self-center'>
        <div ref={container} className='flex flex-row justify-center'>
          <div className={`box w-28`} />
        </div>
      </div>
    </div>
  );
}
