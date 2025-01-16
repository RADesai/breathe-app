// app/routes/magicLink.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '~/db/supabaseClient';

export default function MagicLink() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMagicLink = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error processing magic link:', error.message);
        navigate('/signin'); // Redirect to sign-in on error
      } else {
        console.log('Magic link success:', data);
        navigate('/profile'); // Redirect to profile if successful
      }
    };

    handleMagicLink();
  }, [navigate]);

  return <div>Processing your magic link...</div>;
}
