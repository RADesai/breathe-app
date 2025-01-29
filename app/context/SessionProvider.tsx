import { Session } from "@supabase/supabase-js";
import React, { useCallback } from "react";
import { supabase } from "../db/supabaseClient";

interface SessionContextProps {
  session: Session | null;
  syncSession: (session: Session | null) => void;
  clearSession: () => void;
}

const SessionContext = React.createContext<SessionContextProps | undefined>(
  undefined,
);

export const useSession = (): SessionContextProps => {
  const context = React.useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export function SessionProvider({
  children,
  serverSession,
}: {
  children: React.ReactNode;
  serverSession?: Session | null;
}) {
  const [session, setSession] = React.useState<Session | null>(
    serverSession || null,
  );

  const syncSession = useCallback(
    (newSession: Session | null) => {
      console.log("<SP> syncSession():", newSession);
      if (!newSession || newSession?.access_token !== session?.access_token) {
        console.log(
          "<SP> syncSession() newSession?.access_token !== session?.access_token",
          newSession?.access_token,
          session?.access_token,
        );
        setSession(newSession);
      }
    },

    [session?.access_token],
  );

  const clearSession = useCallback(() => {
    console.log("<SP> clearSession()");
    if (session !== null) {
      supabase.auth.signOut().then(() => {
        document.cookie = "sb-access-token=; path=/; max-age=0;";
        document.cookie = "sb-refresh-token=; path=/; max-age=0;";
        setSession(null);
      });
      // todo: navigate to /signin here?
    }
  }, [session]);

  React.useEffect(() => {
    console.log("<SP> useEffect");
    console.log("<SP> useEffect, session:", session);

    const initializeSession = async () => {
      if (serverSession) {
        console.log("<SP> useEffect, serverSession:", serverSession);
        await supabase.auth.setSession({
          access_token: serverSession.access_token,
          refresh_token: serverSession.refresh_token!,
        });
      } else if (!session) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          console.log("<SP> useEffect, setSession to clientSession");
          setSession(data.session);
        } else {
          console.log("<SP> use effect, no client session found");
        }
        setSession(data.session);
      } else {
        console.log("<SP> useEffect, session exists!");
      }
    };

    initializeSession();

    // Auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setTimeout(() => {
        console.log(
          `<SP> onAuthStateChange() event: "${event}", newSession:`,
          newSession,
        );

        if (event === "SIGNED_OUT" && session !== null) {
          setSession(null);
        } else if (newSession && newSession.user?.id !== session?.user?.id) {
          console.log(
            "<SP> onAuthStateChange(): Updating session",
          );
          setSession(newSession);
        }
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, [serverSession, session, syncSession]);

  return (
    <SessionContext.Provider value={{ session, syncSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}
