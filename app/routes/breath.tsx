
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


export default function Index() {
  const [durations, setDurations] = useState({
    INHALE: 3,
    RETENTION: 3,
    EXHALE: 3,
    SUSPENSION: 3
  });
  const [action, setAction] = useState<Breath>(INHALE)

  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const breathTl = gsap.timeline({ repeat: -1, smoothChildTiming: true });
      const wordsTl = gsap.timeline({ repeat: -1 });
      const carouselTl = gsap.timeline({ repeat: -1 });

      breathTl.fromTo(
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

      wordsTl
        .to('.words', {
          duration: durations.INHALE,
          ease: 'none',
          text: {
            value: 'Inhale',
            padSpace: true,
            type: 'diff'
          },
          onComplete: () => {
            // setAction(RETENTION);
          },
        })
        .to('.words', {
          duration: durations.RETENTION,
          ease: 'none',
          text: {
            value: 'Hold - Retention',
            padSpace: true,
            type: 'diff'
          },
          onComplete: () => {
            // setAction(EXHALE);
          },
        })
        .to('.words', {
          duration: durations.EXHALE,
          ease: 'none',
          text: {
            value: 'Exhale',
            padSpace: true,
            type: 'diff'
          },
          onComplete: () => {
            // setAction(SUSPENSION);
          },
        })
        .to('.words', {
          duration: durations.SUSPENSION,
          ease: 'none',
          text: {
            value: 'Hold - Suspension',
            padSpace: true,
            type: 'diff'
          },
          onComplete: () => {
            // setAction(INHALE);
          },
        });

        carouselTl.fromTo(
          '.carousel',
          { x: 200 },
          { x: -200, duration: durations.INHALE + durations.RETENTION + durations.EXHALE + durations.SUSPENSION, ease: 'power1.inOut' }
        );

        gsap.timeline().add(breathTl).add(carouselTl, 0).add(wordsTl, 0);
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

      <div className='words my-5 font-bold self-center tracking-widest uppercase bg-red-50'>
        test text
      </div>

      <div className='w-50 bg-slate-200'>
        <div className='carousel my-5 font-bold self-center tracking-widest uppercase flex flex-row'>
          {Object.keys(durations).map((step) => (
            <div key={step} className='mx-3 bg-indigo-100 px-2'>
              {step}
            </div>
          ))}
        </div>

      </div>

      <div className='flex flex-col h-60 bg-slate-200 w-fit self-center'>
        <div ref={container} className='flex flex-row justify-center'>
          <div className={`box w-28`} />
        </div>
      </div>
    </div>
  );
}
