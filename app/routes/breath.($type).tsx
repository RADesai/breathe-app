import { json, LoaderFunctionArgs } from '@remix-run/node';
import {
  useLoaderData,
  useOutletContext,
  useRouteError
} from '@remix-run/react';

import { useRef, useState } from 'react';
import BreathTiles from '~/components/BreathTiles';
import useGSAP from '~/hooks/useGSAP';

import { Action, Breath, Duration } from '~/utils/types';

export async function loader({ params }: LoaderFunctionArgs) {
  console.log('in app/routes/breath.($type).tsx, params:', params);
  if (params.type) {
    try {
      console.log('params.type:', params.type);
      const type = params.type; // Get the type from the URL params

      const longMatch = type.match(/i(\d+)r(\d+)e(\d+)s(\d+)/);
      const shortMatch = type.match(/i(\d+)e(\d+)/);

      if (!longMatch && !shortMatch) {
        console.error(`Invalid path format: ${type}`);
      }

      let parsedObject: { [key: string]: number } = {};

      if (longMatch) {
        console.log('longMatch:', longMatch);
        const [, i, r, e, s] = longMatch;
        parsedObject = {
          inhale: parseInt(i) || 0,
          retention: parseInt(r) || 0,
          exhale: parseInt(e) || 0,
          suspension: parseInt(s) || 0
        };
        console.log('parsedObject:', parsedObject);
        return parsedObject;
      } else if (shortMatch) {
        console.log('shortMatch:', shortMatch);
        const [, i, e] = shortMatch;
        parsedObject = {
          inhale: parseInt(i),
          exhale: parseInt(e)
        };
        console.log('parsedObject:', parsedObject);
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
  'bg-[#c54c82] text-white rounded p-2 my-4 w-full tracking-widest flex justify-between items-center shadow hover:shadow-[#c54c82] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none';
// todo: form validate with fields, not current
// todo: set total repetitions / breath count
const BreathComp = () => {
  const { action, setAction, setBreathCount } =
    useOutletContext<OutletContext>();

  const [isPlaying, setPlaying] = useState(false);

  const container = useRef<HTMLDivElement>(null);

  // todo: extract animation to comp?
  const durations: Duration = useLoaderData();

  const { toggleAnimation } = useGSAP({
    isPlaying,
    setPlaying,
    setBreathCount,
    setAction,
    scope: container,
    durations
  });

  return (
    <div className='flex flex-wrap self-center justify-center overflow-scroll gap-1 pt-4 px-2 md:w-2/3'>
      <div id='carousel' className='text-sm font-bold uppercase'>
        <div className='mb-5 font-bold text-center tracking-widest uppercase text-xl'>
          Steps
        </div>
        <BreathTiles action={action} durations={durations} />
      </div>

      <div id='visuals' className=''>
        <div className='mb-5 font-bold text-center tracking-widest uppercase text-xl'>
          Breath
        </div>
        <div className='flex flex-col bg-[#c54c82] bg-opacity-5 w-60 h-80 border-2 border-[#c54c82] rounded'>
          <div ref={container} className='flex justify-center'>
            {Array.from({ length: 240 }, (_, index) => (
              <div
                key={index}
                className={`boxes w-[1px] first-of-type:rounded-bl last-of-type:rounded-br`}
              />
            ))}
          </div>
        </div>
        <div className='flex justify-center gap-4'>
          <button
            disabled={!isPlaying}
            className={buttonStyle}
            onClick={() => {
              if (isPlaying) {
                setPlaying(false);
                toggleAnimation();
              }
            }}
          >
            <svg
              aria-hidden='true'
              className='w-8 h-8 mr-4 opacity-75'
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
            <div>Pause</div>
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
              className='w-8 h-8 mr-4 opacity-75'
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
            <div>Play</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreathComp;

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error)
  // When NODE_ENV=production:
  // error.message = "Unexpected Server Error"
  // error.stack = undefined
  return (
    <div className='flex flex-wrap justify-around overflow-scroll gap-1 font-bold bg-red-400 p-2'>
      Error loading animation, please try again...
    </div>
  );
}
