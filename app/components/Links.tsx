
import { Link } from '@remix-run/react';

const linkClass = 'bg-white p-1 rounded';

const Links = () => {
  return (
    <div className='flex justify-between overflow-scroll gap-1'>
      <Link className={linkClass} to='/breaths/i4e4'>
        Breaths/i4e4
      </Link>
      <Link className={linkClass} to='/breaths/i5e6'>
        Breaths/i5e6
      </Link>
      <Link className={linkClass} to='/breaths/i5r5e5s5'>
        Breaths/i5r5e5s5
      </Link>
      <Link className={linkClass} to='/breaths/i8r4e8s4'>
        Breaths/i8r4e8s4
      </Link>
    </div>
  );
};

export default Links;
