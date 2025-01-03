import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient, Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process?.env.SUPABASE_PROJECT_URL ||
    'https://qcbudtibwgaddbdqthlm.supabase.co',
  process?.env.SUPABASE_PUBLIC_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjYnVkdGlid2dhZGRiZHF0aGxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4ODAzMzcsImV4cCI6MjA1MTQ1NjMzN30.ZjN4P60tEObk--2EpAvtJbavMmJH6yUgETl1WzuoyR8'
);

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
      />
    );
  } else {
    return <div>Logged in!</div>;
  }
}
