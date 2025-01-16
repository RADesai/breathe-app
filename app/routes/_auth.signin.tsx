import { Route } from '.react-router/types/app/routes/+types/_auth.signin';
import { redirect } from 'react-router';
import AuthForm from '~/components/auth/AuthForm';
import { supabaseServer } from '~/db/supabaseServer';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabaseServer.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { error: error.message };
  }

  console.log('Sign-in action complete:', data);
  return redirect('/profile'); // Redirect on successful sign-in
}

export default function SignIn() {
  return <AuthForm actionUrl='/signin' buttonText='Sign In' />;
}
