import { Link } from '@remix-run/react';
import Info from '~/components/Info';
import Links from '~/components/Links';

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
      <div className='p-2 bg-[#94E4FF] flex justify-center font-bold tracking-widest uppercase text-xl'>
        Links
      </div>
      <div className='p-2 bg-[#94E4FF] flex justify-center'>
        <Links />
      </div>
      <div className='p-2'>
        <div>Info:</div>
        <Info />
      </div>
    </div>
  );
}
