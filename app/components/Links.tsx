
import { Link } from '@remix-run/react';

const linkClass = 'bg-white p-1 rounded';

const Links = () => {
  return (
    <div className='flex justify-between overflow-scroll gap-1'>
      <Link className={linkClass} to='/breath/i4e4'>
        Breath/i4e4
      </Link>
      <Link className={linkClass} to='/breath/i5e6'>
        Breath/i5e6
      </Link>
      <Link className={linkClass} to='/breath/i5r5e5s5'>
        Breath/i5r5e5s5
      </Link>
      <Link className={linkClass} to='/breath/i8r4e8s4'>
        Breath/i8r4e8s4
      </Link>
    </div>
  );
};

export default Links;
