import { redirect } from 'react-router';
import { supabaseServer } from '~/db/supabaseServer';

export async function action() {
  console.log('logout.action');
  try {
    console.log('logout.action try to signOut');
    const { error } = await supabaseServer.auth.signOut();
    if (error) {
      console.log('logout.action signOut error');
      throw new Error(error.message);
    }
    console.log('logout.action signout complete, redirect to signin');
    return redirect('/signin');
  } catch (err) {
    console.error('Logout failed:', err);
    return { error: err.message || 'Something went wrong during logout.' };
  }
}
