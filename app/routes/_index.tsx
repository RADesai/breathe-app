import { Link } from '@remix-run/react';
import Info from '~/components/Info';
import Links from '~/components/Links';

import logo from '../logo.png';

const Breathwork = () => (
  <span className='font-bold animate-pulse'>Breathwork</span>
);

export default function Index() {
  return (
    <div className='flex justify-center flex-col text-dark'>
      <nav className='p-2 bg-orange flex items-center gap-4 text-2xl'>
        <Link className='justify-center self-center max-w-20' to='/'>
          <img src={logo} alt='Divine Studio Logo' />
        </Link>
        Divine Studio
      </nav>
      <div className='m-8 text-3xl self-center'>
        Welcome to Divine Studio <Breathwork />
      </div>
      <div className='p-2 bg-orange flex justify-center font-bold tracking-widest uppercase text-xl'>
        Samples
      </div>
      <div className='p-2 bg-orange bg-opacity-50 flex justify-center'>
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
