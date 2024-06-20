import { json, LoaderFunctionArgs } from '@remix-run/node';
import {
  useLoaderData,
  useOutletContext,
  useRouteError
} from '@remix-run/react';

import { useCallback, useRef, useState } from 'react';
import AudioControl from '~/components/AudioControl';
import BreathTiles from '~/components/BreathTiles';
import useGSAP from '~/hooks/useGSAP';

import { Action, Breath, Duration, INHALE } from '~/utils/types';

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.type) {
    try {
      const type = params.type; // Get the type from the URL params

      const longMatch = type.match(/i(\d+)r(\d+)e(\d+)s(\d+)c?(\d+)?/);
      const shortMatch = type.match(/i(\d+)e(\d+)c?(\d+)?/);

      if (!longMatch && !shortMatch) {
        console.error(`Invalid path format: ${type}`);
      }

      let parsedObject: { [key: string]: number } = {};

      if (longMatch) {
        const [, i, r, e, s, c] = longMatch;
        parsedObject = {
          inhale: parseInt(i) || 0,
          retention: parseInt(r) || 0,
          exhale: parseInt(e) || 0,
          suspension: parseInt(s) || 0,
          cycles: parseInt(c) || 0
        };
        return parsedObject;
      } else if (shortMatch) {
        const [, i, e, c] = shortMatch;
        parsedObject = {
          inhale: parseInt(i),
          exhale: parseInt(e),
          cycles: parseInt(c) || 0
        };
        return json(parsedObject);
      } else {
        console.error(`Unable to match route: ${type}`);
      }
    } catch (error) {
      console.error(error); // ? redirect
    }
  }
  return null;
}

interface OutletContext {
  action: Action;
  setBreathCount: React.Dispatch<React.SetStateAction<number>>;
  setAction: React.Dispatch<React.SetStateAction<Breath>>;
  // breathCount: number
}
export const buttonStyle =
  'bg-purple text-white rounded p-2 my-4 tracking-widest flex justify-between items-center shadow hover:shadow-purple disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none';
// todo: form validate with fields, not current
const BreathComp = () => {
  const durations: Duration = useLoaderData();
  const { action, setAction, setBreathCount } =
    useOutletContext<OutletContext>();
  const [isPlaying, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);

  const container = useRef<HTMLDivElement>(null);

  const onComplete = useCallback(() => {
    console.log('cycles complete');
    setAction(INHALE);
    setPlaying(false);
  }, [setAction]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // todo: extract animation to comp?
  const { toggleAnimation, seconds, restartAnimation } = useGSAP({
    isPlaying,
    setPlaying,
    setBreathCount,
    setAction,
    onComplete,
    completed,
    setCompleted,
    scope: container,
    durations,
    audioRef
  });

  return (
    <div className='flex flex-wrap self-center justify-center overflow-scroll gap-1 pt-4 px-2 md:w-2/3 text-dark'>
      <div id='carousel' className='text-sm font-bold uppercase'>
        <div className='mb-5 font-bold text-center tracking-widest uppercase text-xl'>
          Steps
        </div>
        <BreathTiles action={action} durations={durations} seconds={seconds} />
      </div>

      <div id='visuals'>
        <div className='mb-5 font-bold text-center tracking-widest uppercase text-xl'>
          Breath
        </div>
        <div className='flex flex-col bg-dark bg-opacity-5 w-60 h-80 border-4 border-dark rounded'>
          <div ref={container} className='flex justify-center'>
            {Array.from({ length: 240 }, (_, index) => (
              <div
                key={index}
                className={`boxes w-[1px] first-of-type:rounded-bl last-of-type:rounded-br -z-10`}
              />
            ))}
          </div>
          {completed && (
            <div className='font-semibold bg-[#cbf3f0] -z-10 w-full h-full text-center pt-5 p-3'>
              <div className='text-balance'>
                You have completed a breath cycle!
                <br />
                <br />
                We hope you were able to positively impact your physical or
                mental state with this breathing routine.
                <br />
                <br />
                You can repeat this cycle, or if you like, you can browse some
                of the others
                {/* TODO: animate in success */}
              </div>
            </div>
          )}
        </div>
        {/* TODO: extract btn controls to component */}
        <div className='flex justify-center gap-4'>
          <AudioControl audioRef={audioRef} />
          <button
            disabled={!isPlaying}
            className={buttonStyle}
            onClick={() => {
              if (isPlaying) {
                console.log(
                  '** isplaying already!, setPlaying(false) && toggleAnimation()'
                );
                setPlaying(false);
                toggleAnimation();
              }
            }}
          >
            <svg
              aria-hidden='true'
              className='w-8 h-8'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 5.25v13.5m-7.5-13.5v13.5'
              />
            </svg>
          </button>
          <button
            disabled={isPlaying}
            className={buttonStyle}
            onClick={() => {
              if (!isPlaying) {
                setPlaying(true);
                toggleAnimation();
              }
            }}
          >
            <svg
              aria-hidden='true'
              className='w-8 h-8'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z'
              />
            </svg>
          </button>
          <div>
            <button className={buttonStyle} onClick={() => restartAnimation()}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-8 h-8'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathComp;

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  // When NODE_ENV=production:
  // error.message = "Unexpected Server Error"
  // error.stack = undefined
  return (
    <div className='flex flex-wrap justify-around overflow-scroll gap-1 font-bold bg-red-400 p-2'>
      Error loading animation, please try again...
    </div>
  );
}
