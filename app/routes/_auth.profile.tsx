import { useEffect } from 'react';
import {
  Form,
  useActionData,
  useNavigate,
  useOutletContext
} from 'react-router';
import { OutletContext } from '~/root';
import { formStyles } from '~/utils/styles';

export default function Profile() {
  const { user } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const actionData = useActionData<{ error?: string }>();

  // Redirect to /signin if no user session exists
  useEffect(() => {
    console.log('<Profile.useEffect>');
    if (user === undefined) {
      console.log('<Profile.useEffect> "user = undefined"');
      // Skip redirect logic until the user object is fully resolved
      return;
    }

    if (!user) {
      console.log('<Profile.useEffect> !user -> navigate("/signin")');
      navigate('/signin');
    }
  }, [user, navigate]);

  // Avoid rendering while user is undefined
  if (user === undefined) {
    console.log('<Profile> "user = undefined"');
    // Optionally show a loading spinner while resolving user state
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('<Profile> !user');
    return null; // Prevent rendering if no user exists
  }

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Profile</h1>
      <div className='text-lg'>Welcome, {user.email || 'Guest'}!</div>

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
