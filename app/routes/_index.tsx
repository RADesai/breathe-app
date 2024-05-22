import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import Info from '~/components/Info';
import Links from '~/components/Links';

export const meta: MetaFunction = () => {
  return [
    { title: 'Breathe App' },
    { name: 'Breathe', content: 'Take a Breath' },
  ];
};

// if (typeof window !== 'undefined') {
//   gsap.registerPlugin(useGSAP, TextPlugin);
// }

const Breathwork = () => (
  <span className='font-bold animate-pulse'>Breathwork</span>
);

export default function Index() {
  return (
    <div className='flex justify-center flex-col'>
      <Link className='p-2 bg-[#94E4FF] tracking-widest' to='/breath'>
        Breath
      </Link>
      <div className='m-10 text-2xl'>
        Welcome to <Breathwork /> (app/routes/_index.tsx)
      </div>
      <div className='p-2 bg-[#94E4FF]'>
        <div>Links:</div>
        <Links />
      </div>
      <div className='p-2'>
        <div>Info:</div>
        <Info />
      </div>
    </div>
  );
}
