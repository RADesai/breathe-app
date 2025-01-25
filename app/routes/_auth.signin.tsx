import { Route } from ".react-router/types/app/routes/+types/_auth.signin";
import { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { data as rrData, useActionData, useNavigate } from "react-router";
import AuthForm from "~/components/auth/AuthForm";
import { useSession } from "~/context/SessionProvider";
import { sessionCookie } from "~/db/cookies";
import { getSupabaseServer } from "~/db/supabaseServer";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabaseServer = getSupabaseServer(request);
  const { data, error } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  console.log("Sign-in action complete:", data);

  return rrData(
    { session: data.session },
    {
      headers: {
        "Set-Cookie": await sessionCookie.serialize(data.session.access_token),
      },
    },
  );
}

export default function SignIn() {
  const { session, syncSession } = useSession();
  const navigate = useNavigate();

  const actionData = useActionData<{ session?: Session }>();
  console.log("sign in actionData:", actionData);

  useEffect(() => {
    if (
      actionData?.session &&
      actionData?.session.user?.id !== session?.user?.id
    ) {
      console.log(
        "<SignIn.useEffect> actionData?.session.user?.id !== session?.user?.id",
        actionData?.session.user?.id,
        session?.user?.id,
      );
      syncSession(actionData.session);
      navigate("/", { replace: true });
    }
  }, [actionData?.session, navigate, session?.user?.id, syncSession]);

  return <AuthForm actionUrl="/signin" buttonText="Sign In" />;
}
