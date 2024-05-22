import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { useRef, useState } from 'react';
import BreathTiles from '~/components/BreathTiles';
import Controls from '~/components/Controls';
import useGSAP from '~/hooks/useGSAP';
import { Breath, INHALE } from '~/utils/types';
import audio_exhale from '../../audio/exhale.m4a';
import audio_inhale from '../../audio/inhale.wav';
import { Duration } from './breaths';

export async function loader({ params }: LoaderFunctionArgs) {
  console.log('in app/routes/breaths.($type).tsx, params:', params);
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

// todo: form validate with fields, not current
// todo: set total repetitions / breath count
const BreathComp = () => {
  const [action, setAction] = useState<Breath>(INHALE);
  const [breathCount, setBreathCount] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [playingAudio, setPlaying2] = useState<
    undefined | '../../audio/exhale.m4a' | '../../audio/inhale.wav'
  >(undefined);

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

  console.log('breaths:toggleAnimation:', toggleAnimation);

  return (
    <div className='flex flex-wrap justify-around overflow-scroll gap-1 p-2'>
      <div id='carousel' className='text-sm font-bold uppercase'>
        <BreathTiles action={action} durations={durations} />
        <audio src={audio_inhale}>
          <track kind='captions' label='inhale' />
        </audio>
        <audio src={audio_exhale}>
          <track kind='captions' label='exhale' />
        </audio>
      </div>

      <div id='visuals' className=''>
        <div className='flex flex-col bg-[#c54c82] bg-opacity-20 w-60 h-80 border-2 border-[#c54c82] rounded'>
          <div ref={container} className='flex justify-center'>
            {Array.from({ length: 120 }, (_, index) => (
              <div
                key={index}
                className={`boxes w-[2px] first-of-type:rounded-bl last-of-type:rounded-br`}
              />
            ))}
          </div>
        </div>
        <button
          className='w-full bg-[#c54c82] text-white rounded p-2 my-5 tracking-widest'
          onClick={() => {
            if (isPlaying) {
              setPlaying(false);
              console.log(`pause`);
              toggleAnimation()
            } else {
              setPlaying(true);
              console.log(`play`);
              toggleAnimation();
            }
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      <Controls
        resetAnimation={() => {
          console.log('resetting animation:');
        //   context.revert();
        }}
      />

      <div className='self-center my-5 text-slate-500'>
        You have been here for {breathCount} breaths
      </div>
    </div>
  );
};

export default BreathComp;
