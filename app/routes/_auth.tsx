import { Outlet } from 'react-router';

import Nav from '~/components/Nav';

// TODO: extract common layout code w Breath.tsx

export default function Index() {
  return (
    <div className='flex justify-center flex-col'>
      <Nav />
      <div className='p-2 bg-white flex justify-center font-bold tracking-widest uppercase text-xl text-purple'>
        Login / Registration
      </div>
      <div className='flex flex-wrap self-center justify-center overflow-scroll gap-1 pt-4 px-2 md:w-2/3 text-dark'>
        <Outlet />
      </div>
    </div>
  );
}
