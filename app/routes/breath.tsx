import { Link, Outlet } from '@remix-run/react';

import { useEffect, useRef, useState } from 'react';
import Controls from '~/components/Controls';
import { Breath as BreathType, INHALE } from '~/utils/types';
import audio_exhale from '../../audio/exhale.m4a';
import audio_inhale from '../../audio/inhale.wav';

const stopAudio = () => {
  const audio1 = new Audio(audio_inhale);
  audio1.pause();
  const audio2 = new Audio(audio_exhale);
  audio2.pause();
};

export default function Index() {
  // todo: sync audio (? will it resolve insertBefore error ?)
  const [audioInhale, setAudioInhale] = useState<HTMLAudioElement | null>(null);
  const [audioExhale, setAudioExhale] = useState<HTMLAudioElement | null>(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Fetch or create audio objects on component mount (replace with your logic)
    setAudioInhale(new Audio('../../audio/inhale.wav'));
    setAudioExhale(new Audio('../../audio/exhale.m4a'));
  }, []);

  const [action, setAction] = useState<BreathType>(INHALE);
  const [breathCount, setBreathCount] = useState(0);

  return (
    <div className='flex justify-center flex-col'>
      <Link
        className='p-2 bg-[#94E4FF] tracking-widest'
        to='/'
        onClick={() => stopAudio()}
      >
        Home
      </Link>
      <audio src={audio_inhale}>
        <track kind='captions' label='inhale' />
      </audio>
      <audio src={audio_exhale}>
        <track kind='captions' label='exhale' />
      </audio>
      <Outlet
        context={{
          action,
          setAction,
          breathCount,
          setBreathCount
        }}
      />
      <Controls
        breathCount={breathCount}
        resetAnimation={() => {
          // console.log('resetting animation:');
          setAction(INHALE);
        }}
      />
    </div>
  );
}
