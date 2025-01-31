import { useActionData, useNavigate } from "react-router";
import { PleaseLogin } from "~/components/auth/PleaseLogin";
import { useSession } from "~/context/SessionProvider";
import { formStyles } from "~/utils/styles";

export default function Profile() {
  const { session, clearSession } = useSession();
  const navigate = useNavigate();
  const actionData = useActionData<{
    error?: { message?: string; code?: string };
  }>();

  if (!session?.user) {
    return <PleaseLogin message="to access your profile." />;
  }

  const handleLogout = async () => {
    try {
      await fetch("/logout", { method: "POST" });
      clearSession();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center text-lg">
        Hello{" "}
        <span className="font-bold">
          {session?.user.user_metadata.name || "Guest"}!
        </span>
      </div>

      {actionData?.error && (
        <div className={formStyles.error}>{actionData.error.message}</div>
      )}

      <div className="mb-20 mt-4">
        <p className={`${formStyles.error} my-2 text-sm tracking-widest`}>
          This page is still under construction!
        </p>
      </div>

      <button onClick={handleLogout} className={formStyles.outlineButton}>
        Logout
      </button>
    </div>
  );
}
