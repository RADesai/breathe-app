import { Link, Outlet } from '@remix-run/react';

import { useState } from 'react';
import { Breath as BreathType, INHALE } from '~/utils/types';

import logo from '../logo.png';

export default function Index() {
  const [action, setAction] = useState<BreathType>(INHALE);
  const [breathCount, setBreathCount] = useState(0);

  return (
    <div className='flex justify-center flex-col'>
      <nav className='p-2 bg-orange flex items-center gap-4 text-2xl'>
        <Link className='justify-center self-center max-w-20' to='/'>
          <img src={logo} alt='Divine Studio Logo' />
        </Link>
        Divine Studio
      </nav>
      <Outlet
        context={{
          action,
          setAction,
          breathCount,
          setBreathCount
        }}
      />
      {/* <Controls
        breathCount={breathCount}
        resetAnimation={() => {
          console.log('resetting animation:');
          // todo: pass func to useGSAP to actually reset animation
          setAction(INHALE);
        }}
      /> */}
    </div>
  );
}
