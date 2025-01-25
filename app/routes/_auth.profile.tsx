import { Link, useActionData, useNavigate } from "react-router";
import Spinner from "~/components/Spinner";
import { useSession } from "~/context/SessionProvider";
import { formStyles } from "~/utils/styles";

export default function Profile() {
  const { session, clearSession } = useSession();
  const navigate = useNavigate();
  const actionData = useActionData<{ error?: string }>();

  if (!session?.user) {
    console.log("<Profile> !session?.user");

    return (
      <div className="flex flex-col items-center">
        <p className="text-center font-cherry text-sm">
          Please <Link
            className={formStyles.link}
            to="/signin"
          >Login
          </Link> to access your profile.
        </p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      console.log("<Profile> handleLogout! POST(/logout)");
      await fetch("/logout", { method: "POST" }); // Call server action
      console.log("<Profile> handleLogout! clearSession()");
      clearSession(); // Clear client session
      console.log("<Profile> handleLogout! navigate(/signin)");
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg">
        {session?.user.user_metadata.name || "Guest"}!
      </div>

      {actionData?.error && (
        <div className={formStyles.error}>{actionData.error}</div>
      )}

      <button onClick={handleLogout} className={formStyles.submitButton}>
        Logout
      </button>
    </div>
  );
}
