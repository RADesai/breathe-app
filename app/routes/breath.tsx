import { Outlet } from 'react-router';

import { useState } from 'react';
import { Breath as BreathType, INHALE } from '~/utils/types';

import Nav from '~/components/Nav';

export default function Index() {
  const [action, setAction] = useState<BreathType>(INHALE);
  const [breathCount, setBreathCount] = useState(0);

  return (
    <div className='flex justify-center flex-col'>
      <Nav />
      <div className='p-2 bg-pink flex justify-center font-bold tracking-widest uppercase text-xl text-white'>
        Breath
      </div>
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
