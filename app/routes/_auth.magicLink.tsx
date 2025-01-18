// app/routes/magicLink.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "~/db/supabaseClient";
import Spinner from "../components/Spinner";

export default function MagicLink() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMagicLink = async () => {
      console.log("<MagicLink /> useEffect");
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error processing magic link:", error.message);
        navigate("/signin"); // Redirect to sign-in on error
      } else {
        console.log("Magic link success:", data);

        // Refresh the session to ensure the server can access it via cookies
        const refreshResult = await supabase.auth.refreshSession();
        if (refreshResult.error) {
          console.error("Error refreshing session:", refreshResult.error);
            navigate("/signin");
          return;
        }

        console.log("refreshSession() success!!");
        console.log("Magic link refreshSession():", refreshResult);
        console.log("Client side Cookies:", document.cookie); // Inspect cookies
        console.log("supabase.auth:", supabase.auth);
        // Redirect to profile & force reload to sync session with server
        window.location.href = "/";
      }
    };

    handleMagicLink();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center">
      <Spinner />
      <div>Verifying your magic link...</div>;
    </div>
  );
}
