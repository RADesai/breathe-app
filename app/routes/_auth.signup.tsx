import { Route } from '.react-router/types/app/routes/+types/_auth.signup';
import { User } from '@supabase/supabase-js';
import { ParseError, parsePhoneNumberWithError } from 'libphonenumber-js';
import { redirect } from 'react-router';
import AuthForm from '~/components/auth/AuthForm';
import { getSupabaseServer } from '~/db/supabaseServer';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  console.log('signup! formData:', formData);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;

  if (!email || !password || !name || !phone) {
    // todo: form validation
    return { error: 'All fields are required.' };
  }

  const supabaseServer = getSupabaseServer(request);
  const {
    data: { users },
    error: userCheckError
  } = await supabaseServer.auth.admin.listUsers();
  if (userCheckError) {
    console.error('Error checking user existence:', userCheckError.message);
    return { error: 'Failed to connect to database. Please try again.' };
  }

  const userExists = users?.find((user: User) => user.email === email);
  if (userExists) {
    return {
      // todo: provide link to /signin with this error
      error: 'This email is already registered. Please sign in instead.'
    };
  }

  try {
    const phoneNumber = parsePhoneNumberWithError(phone, {
      defaultCountry: 'US'
    });
    console.log('parsePhoneNumberWithError:', phoneNumber);
    console.log('phoneNumber.isValid():', phoneNumber.isValid());
    if (!phoneNumber || !phoneNumber.isValid()) {
      return {
        error: 'Invalid phone number. Please enter a valid phone number.'
      };
    }
  } catch (error) {
    console.log('catch(e) parsePhoneNumberWithError:', error);
    if (error instanceof ParseError) {
      // Not a phone number, non-existent country, etc.
      return {
        error: error.message
      };
    } else {
      throw error;
    }
  }

  console.log('Try to sign-up user to supabase...', formData);
  const { error } = await supabaseServer.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone },
      emailRedirectTo: `${import.meta.env.VITE_APP_URL}/magicLink`
    }
  });

  if (error) {
    console.error('Sign-up Error:', error.message);
    return { error: error.message };
  }

  console.log('Sign-up Complete:', redirect('/profile'));

  return redirect(`/confirmemail?email=${encodeURIComponent(email)}`);
}

export default function SignUp() {
  return <AuthForm actionUrl='/signup' buttonText='Register' />;
}
