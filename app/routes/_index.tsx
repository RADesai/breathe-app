import { Link } from '@remix-run/react';
import Info from '~/components/Info';
import Links from '~/components/Links';

import logo from '../logo.png';


const Breathwork = () => (
  <span className='font-bold animate-pulse'>Breathwork</span>
);

export default function Index() {
  return (
    <div className='flex justify-center flex-col text-[#2d3142]'>
      <div className='p-2 bg-[#94E4FF] flex items-center gap-4'>
        <Link className='justify-center self-center max-w-20' to='/'>
          <img src={logo} alt='Divine Studio Logo' />
        </Link>
        <Link className='tracking-widest' to='/breath'>
          Breath
        </Link>
      </div>
      <div className='m-8 text-3xl self-center'>
        Welcome to Divine Studio <Breathwork />
      </div>
      <div className='p-2 bg-[#94E4FF] flex justify-center font-bold tracking-widest uppercase text-xl'>
        Samples
      </div>
      <div className='p-2 bg-[#94E4FF] flex justify-center'>
        <Links />
      </div>
      <div className='p-2'>
        <div>Info:</div>
        <Info />
      </div>
      <img src={logo} alt='Divine Studio Logo' />
    </div>
  );
}
