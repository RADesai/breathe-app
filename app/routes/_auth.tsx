import { useEffect } from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router';

import Nav from '~/components/Nav';
import { OutletContext } from '~/root';


// ? todo: delete _auth and just use profile as the root auth component?
export default function Index() {
  const { user } = useOutletContext<OutletContext>();
  const navigate = useNavigate()
  console.log('_auth -> user:', user);

  useEffect(() => {
    console.log('<_auth> useEffect:', user);
    if (
      !user &&
      (location.pathname !== '/signin' && location.pathname !== '/signup')
    ) {
      console.log('<_auth> useEffect, !user');
      // Redirect to Sign In page if no user session exists
      // navigate('/signin', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className='flex justify-center flex-col'>
      <Nav />
      <div className='p-2 bg-purple flex justify-center font-bold tracking-widest uppercase text-xl text-white'>
        Profile
      </div>
      <div className='flex flex-wrap self-center justify-center overflow-scroll gap-1 pt-4 px-2 md:w-2/3'>
        <Outlet context={{ user }} />
      </div>
    </div>
  );
}
