import { Route } from ".react-router/types/app/routes/+types/_auth.confirmEmail";
import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { getSupabaseServer } from "~/db/supabaseServer";
import { formStyles } from "~/utils/styles";

import { useState } from "react";
import logo from "../logo.webp";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  if (!email) {
    return new Response(JSON.stringify({ error: "No email provided." }), {
      status: 400,
    });
  }

  const supabaseServer = getSupabaseServer(request);
  const { error } = await supabaseServer.auth.resend({
    email,
    type: "signup",
    options: {
      emailRedirectTo: `${import.meta.env.VITE_APP_URL}/emailVerify`,
    },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
}

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const actionData = useActionData<{ error?: string }>();

  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  const [resendEmail, setResendEmail] = useState(email || "");

  return (
    <div className="confirmation-page">
      <Form
        method="post"
        action="/confirmemail"
        className="flex flex-col gap-6 rounded-lg border border-dark border-opacity-50 bg-white px-10 py-8 drop-shadow-lg"
      >
        <img
          src={logo}
          className="max-w-16 self-center"
          alt="Divine Studio Logo"
        />

        <h1>Check Your Email For a Verification Link</h1>
        <p className="text-sm">
          <p>A confirmation email has been sent to your inbox.</p>
          <p>
            Please follow the link in the email to complete your registration.
          </p>
          <br />
          <p>
            <strong>Didn&apos;t get the email?</strong> Check your spam folder
            or resend the confirmation email.
          </p>
        </p>
        <div className="flex flex-col">
          <label className={formStyles.label} htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            name="email"
            required
            className={
              actionData?.error ? formStyles.inputError : formStyles.input
            }
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <button
          className={formStyles.submitButton}
          type="submit"
          disabled={isLoading}
        >
          Resend Email Verification
        </button>
      </Form>
    </div>
  );
}
