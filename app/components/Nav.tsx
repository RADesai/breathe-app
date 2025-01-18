import { Link, useNavigate, useOutletContext } from 'react-router';
import { OutletContext } from '~/root';
import logo from '../logo.png';
import { useSession } from '~/context/SessionProvider';

export default function Nav() {
  // todo: navigate to '/signin' if no user || '/profile' with user
  // todo: style user button for active/inactive user session
  const navigate = useNavigate();
  // const { user } = useOutletContext<OutletContext>();
  const session = useSession();

  return (
    <nav className='p-2 grid grid-cols-5 items-center sm:px-10 border-b-2 border-dark'>
      <Link className='text-left flex gap-4' to='/'>
        <img
          src={logo}
          className='max-w-16 justify-self-center md:justify-self-start'
          alt='Divine Studio Logo'
        />
        <div className='hidden md:block self-center md:text-2xl font-cherry text-center'>
          Divine Studio
        </div>
      </Link>
      <div className='col-span-3 font-bold text-3xl font-cherry text-center'>
        <div className='md:hidden self-center text-sm font-cherry tracking-widest'>
          Divine Studio
        </div>
        Breathwork
      </div>
      <div className='text-xs text-purple font-cherry font-bold'>This website is still a work in progress!</div>
      {/* <button
        className='text-right cursor-pointer hover:underline'
        onClick={() => (session?.user ? navigate('/profile') : navigate('/signin'))}
      >
        {session?.user ? session?.user.user_metadata.name : 'User'}
      </button> */}
    </nav>
  );
}
