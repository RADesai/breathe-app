import { Link } from 'react-router';

import logo from '../logo.png';

const Breathwork = () => (
  <span className='font-bold animate-pulse'>Breathwork</span>
);


export default function Nav() {
  return (
    <nav className='p-2 flex gap-4 justify-center sm:px-10 md:px-20'>
      <Link className='max-w-20' to='/'>
        <img src={logo} alt='Divine Studio Logo' />
      </Link>
      <div className='m-8 text-2xl'>Divine Studio <Breathwork /></div>
    </nav>
  );
}
