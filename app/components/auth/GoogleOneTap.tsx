import { useEffect } from 'react';
import { supabase } from '~/db/supabaseClient';

export default function GoogleOneTap() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response: CredentialResponse) => {
          const { credential } = response;

          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: credential
          });

          if (error) {
            console.error('Google Sign-In Error:', error.message);
          } else {
            console.log('User signed in:', data.user);
            // Redirect after sign-in
            window.location.href = '/profile';
          }
        },
        auto_select: true
      });

      window.google.accounts.id.prompt(); // Show the One-Tap prompt
    }
  }, []);

  return null; // No UI required for One-Tap login
}
