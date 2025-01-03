import * as React from 'react';
import logo from '../logo.png';


export default function SignInForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  // const navigate = useNavigate();

  // Handle the submission of the sign-in form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      console.log('trying')
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Display a form to capture the user's email and password
  return (
    <div className='my-5'>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className='py-8 px-10 bg-white border border-dark border-opacity-50 drop-shadow-lg rounded-lg flex flex-col gap-8'
      >
        <img
          src={logo}
          className='max-w-16 self-center'
          alt='Divine Studio Logo'
        />
        <div>
          <h1 className='text-xl text-center font-bold'>
            Sign in to Breathwork
          </h1>
          <h3 className='text-sm text-center font-cherry'>
            Please sign in to use the breathing tool
          </h3>
        </div>
        <button
          className='border border-opacity-10 py-2 px-3 w-full rounded-lg border-purple'
          type='button'
          onClick={() => console.log('google auth')}
        >
          Continue with Google
        </button>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col'>
            <label className='font-cherry' htmlFor='email'>
              Email address
            </label>
            <input
              className='py-2 px-3 border text-sm border-dark border-opacity-50 drop-shadow rounded-lg'
              onChange={(e) => setEmail(e.target.value)}
              id='email'
              name='email'
              type='email'
              value={email}
            />
          </div>
          <div className='flex flex-col'>
            <label className='font-cherry' htmlFor='password'>
              Password
            </label>
            <input
              className='py-2 px-3 border text-sm border-dark border-opacity-50 drop-shadow rounded-lg'
              onChange={(e) => setPassword(e.target.value)}
              id='password'
              name='password'
              type='password'
              value={password}
            />
          </div>
        </div>
        <button
          className='border border-opacity-10 py-2 px-3 w-full rounded-lg border-dark bg-orange'
          type='submit'
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
