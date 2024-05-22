import { Link, Outlet } from '@remix-run/react';

import audio_exhale from '../../audio/exhale.m4a';
import audio_inhale from '../../audio/inhale.wav';

export interface Duration {
  inhale: number;
  retention: number;
  exhale: number;
  suspension: number;
}

const stopAudio = () => {
  const audio1 = new Audio(audio_inhale);
  audio1.pause();
  const audio2 = new Audio(audio_exhale);
  audio2.pause();
};

export default function Index() {
  return (
    <div className='flex justify-center flex-col'>
      <Link
        className='p-2 bg-[#94E4FF] tracking-widest'
        to='/'
        onClick={() => stopAudio()}
      >
        Home
      </Link>

      <Outlet />
    </div>
  );
}
