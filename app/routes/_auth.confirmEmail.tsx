import { Route } from '.react-router/types/app/routes/+types/_auth.confirmEmail';
import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams
} from 'react-router';
import { supabaseServer } from '~/db/supabaseServer';
import { formStyles } from '~/utils/styles';

import logo from '../logo.png';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;

  if (!email) {
    return new Response(JSON.stringify({ error: 'No email provided.' }), {
      status: 400
    });
  }

  /* email verify link redirects to:
    - https://qcbudtibwgaddbdqthlm.supabase.co
    - /auth
    - /v1
    - /verify?
      - token=eea558108f3e06332f2649005de73511410ff51e281c74ab40bb9a7b&
      - type=signup&
      - redirect_to=http://localhost:3000
      //  - onsuccess
  */

  const { error } = await supabaseServer.auth.resend({
    email,
    type: 'signup',
    options: {
      emailRedirectTo: `${import.meta.env.VITE_APP_URL}/emailVerify`
    }
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400
    });
  }

  return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
}

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const actionData = useActionData<{ error?: string }>();

  const navigation = useNavigation();
  const isLoading = navigation.state === 'submitting';

  return (
    <div className='confirmation-page'>
      <Form
        method='post'
        action='/confirmemail'
        className='py-8 px-10 bg-white border border-dark border-opacity-50 drop-shadow-lg rounded-lg flex flex-col gap-6'
      >
        <img
          src={logo}
          className='max-w-16 self-center'
          alt='Divine Studio Logo'
        />

        <h1>Check Your Email</h1>
        <p>
          A confirmation email has been sent to your inbox. Please follow the
          link in the email to complete your registration.
        </p>
        <p>
          <strong>Didn&apos;t get the email?</strong> Check your spam folder or{' '}
          <a href='/resend-email'>resend the confirmation email</a>.
        </p>
        <div className='flex flex-col'>
          <label className={formStyles.label} htmlFor='email'>
            Email:
          </label>
          <input
            type='email'
            name='email'
            required
            className={
              actionData?.error ? formStyles.inputError : formStyles.input
            }
            value={email || ''}
            autoComplete='email'
          />
        </div>
        <button
          className={formStyles.submitButton}
          type='submit'
          disabled={isLoading}
        >
          Resend Email Verification
        </button>
      </Form>
    </div>
  );
}
