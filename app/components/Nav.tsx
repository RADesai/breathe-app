import { Link } from 'react-router';
import logo from '../logo.png';

export default function Nav() {

  return (
    <nav className='p-2 grid grid-cols-5 items-center sm:px-10 md:px-20 border-b-2 border-dark'>
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
      <div className='text-right'>
        User
      </div>
    </nav>
  );
}
