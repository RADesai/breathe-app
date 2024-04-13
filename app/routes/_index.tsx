import { useGSAP } from '@gsap/react';
import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import gsap from 'gsap/dist/gsap';

export const meta: MetaFunction = () => {
  return [
    { title: 'Breathe App' },
    { name: 'Breathe', content: 'Take a Breath' },
  ];
};

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

const Breathwork = () => (
  <span className='font-bold animate-pulse'>Breathwork</span>
);

export default function Index() {
  return (
    <div className='flex justify-center flex-col'>
      <Link className='p-2 bg-blue-200 tracking-widest' to='/breath'>
        Breath
      </Link>
      <div className='m-10 text-2xl'>
        Welcome to <Breathwork />
      </div>
    </div>
  );
}
