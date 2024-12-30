import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/react-router';
import { Link } from 'react-router';
import logo from '../logo.png';

const Breathwork = () => (
  <div className='font-bold animate-pulse'>Breathwork</div>
);

export default function Nav() {
  const { user, isSignedIn } = useUser();
  console.log('in nav, user, isSignedIn:', user, isSignedIn);

  return (
    <nav className='p-2 grid grid-cols-3 items-center sm:px-10 md:px-20'>
      <Link className='text-left' to='/'>
        <img src={logo} className='max-w-20' alt='Divine Studio Logo' />
      </Link>
      <div className='text-2xl font-cherry text-center'>
        Divine Studio <Breathwork />
      </div>
      <div className='text-right'>
        <SignedOut>
          <SignInButton>
            <button className='focus:underline hover:underline'>
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonPopoverCard:
                  'bg-orange shadow-lg border-2 border-orange p-2',
                userButtonAvatarBox: 'w-6 h-6',
                userButtonPopoverMain: 'bg-white',
                userButtonPopoverFooter: 'hidden'
              }
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
}
