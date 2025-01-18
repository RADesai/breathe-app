import { useEffect } from 'react';
import {
  Form,
  useActionData,
  useNavigate
} from 'react-router';
import Spinner from '~/components/Spinner';
import { useSession } from '~/context/SessionProvider';
import { formStyles } from '~/utils/styles';

export default function Profile() {
  // const { user } = useOutletContext<OutletContext>();
  const session = useSession();
  const navigate = useNavigate();

  const actionData = useActionData<{ error?: string }>();

  // Redirect to /signin if no user session exists
  useEffect(() => {
    console.log('<Profile.useEffect>');
    if (session?.user === undefined) {
      console.log('<Profile.useEffect> "session?.user = undefined"');
      // Skip redirect logic until the session?.user object is fully resolved
      return;
    }

    if (!session?.user) {
      console.log('<Profile.useEffect> !session?.user -> navigate("/signin")');
      navigate('/signin');
    }
  }, [session?.user, navigate]);

  // Avoid rendering while user is undefined
  if (session?.user === undefined) {
    console.log('<Profile> "user = undefined"');
    // Optionally show a loading spinner while resolving user state
    return (
      <div className='flex flex-col items-center'>
        <Spinner />
        <div>Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    console.log('<Profile> !session?.user');
    return null; // Prevent rendering if no session?.user exists
  }

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Profile</h1>
      <div className='text-lg'>Welcome, {session?.user.email || 'Guest'}!</div>

      {actionData?.error && (
        <div className='text-red mt-2'>{actionData.error}</div>
      )}

      <Form method='post' action='/logout'>
        <button type='submit' className={formStyles.submitButton}>
          Logout
        </button>
      </Form>
    </div>
  );
}
