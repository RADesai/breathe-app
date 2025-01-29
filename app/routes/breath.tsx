import { Outlet } from 'react-router';

import { useState } from 'react';
import { Breath as BreathType, INHALE } from '~/utils/types';

import Nav from '~/components/Nav';
import Bar from '~/components/Bar';

export default function Index() {
  const [action, setAction] = useState<BreathType>(INHALE);
  const [breathCount, setBreathCount] = useState(0);

  return (
    <div className="flex flex-col justify-center">
      <Nav />
      <Bar title="Breath" className="bg-pink text-white" />
      <Outlet
        context={{
          action,
          setAction,
          breathCount,
          setBreathCount,
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
