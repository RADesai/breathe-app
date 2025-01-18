import { Session } from "@supabase/supabase-js";
import React from "react";
import { supabase } from "../db/supabaseClient";

export type SessionContext = { session: Session | null };

const SessionContext = React.createContext<Session | null>(null);

export const useSession = () => React.useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    console.log("<session provider> use effect");
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("<SessionProvider> getSession:", session);
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("<SessionProvider> Auth state change:", event, session);

      if (event === "SIGNED_OUT") {
        console.log("<auth provider> SIGNED_OUT");
        setSession(null);
      } else if (session) {
        console.log("<auth provider> session:", session);
        setSession(session);
      }
    });

    console.log("<auth provider> use effect << destroy >>");
    return () => subscription.unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
