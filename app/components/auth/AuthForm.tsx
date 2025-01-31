import { Form, Link, useActionData, useNavigation } from "react-router";
import { formStyles } from "~/utils/styles";

import logo from "../../logo.webp";
import Spinner from "../Spinner";

import { AsYouType } from "libphonenumber-js";
import { useState } from "react";

type AuthFormProps = {
  actionUrl: string;
  buttonText: string;
};

const AuthLink = ({ isRegistration }: { isRegistration?: boolean }) => (
  <div className="font-cherry text-sm">
    {isRegistration ? "Already have an account? " : "Don't have an account? "}
    <Link
      className={formStyles.link}
      to={isRegistration ? "/signin" : "/signup"}
    >
      {isRegistration ? "Sign In" : "Sign Up"}
    </Link>
  </div>
);

const InvalidCredentials = () => {
  return (
    <div className={formStyles.error}>
      Invalid email or password. Please try again.
    </div>
  );
};

const FormError = ({ error }: { error: { message?: string; code?: string } }) => {
  if (!error) return null;

  if (error.code === "invalid_credentials") {
    return <InvalidCredentials />;
  }

  if (error.code === "email_not_confirmed") {
    return (
      <div className={formStyles.error}>
        Email has not been verified. Please check your email for a confirmation link.
        <div className="bg-white mt-2 p-2 rounded-sm">
          <Link className={formStyles.link} to="/confirmemail">
            Resend the email verification link
          </Link>{" "}
          if you have not received a link or need a new one.
        </div>
      </div>
    );
  }

  if (error.code === "email_exists") {
    return (
      <div className={formStyles.error}>
        Email already exists. Please sign in or use a different email.
      </div>
    );
  }

  return <div className={formStyles.error}>{error.message}</div>;
};

export default function AuthForm({ actionUrl, buttonText }: AuthFormProps) {
  const actionData = useActionData<{
    error?: { message?: string; code?: string };
    success?: string;
  }>();
  const navigation = useNavigation();

  const isRegistration = actionUrl === "/signup";
  const isLoading = navigation.state === "submitting";

  // todo: client side validation
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="auth-form mb-10">
      <Form
        method="post"
        action={actionUrl}
        className="border-dark border-opacity-50 caret-purple flex flex-col gap-6 rounded-lg border bg-white px-10 py-8 drop-shadow-lg"
      >
        <img
          src={logo}
          className="max-w-16 self-center"
          alt="Divine Studio Logo"
        />

        {isRegistration ? (
          <div>
            <h1 className="text-center text-xl font-bold">
              Register for Access
            </h1>
            <h3 className="font-cherry text-center text-sm">
              Please register to use our breathing tool
            </h3>
          </div>
        ) : (
          <div>
            <h1 className="text-center text-xl font-bold">
              Sign in to Breathwork
            </h1>
            <h3 className="font-cherry text-center text-sm">
              Please sign in to use our breathing tool
            </h3>
          </div>
        )}

        {/* todo: <button
          className={formStyles.outlineButton}
          type='button'
          onClick={() => console.log('google auth')}
          disabled={isLoading}
        >
          Continue with Google
        </button> */}

        <div className="flex flex-col gap-4">
          {isRegistration && (
            <>
              <div className="flex flex-col">
                <label className={formStyles.label} htmlFor="name">
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className={
                    actionData?.error ? formStyles.inputError : formStyles.input
                  }
                  autoComplete="name"
                />
              </div>
              <div className="flex flex-col">
                <label className={formStyles.label} htmlFor="phone">
                  Phone:
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  className={
                    actionData?.error ? formStyles.inputError : formStyles.input
                  }
                  autoComplete="tel"
                  onChange={(e) => {
                    setPhoneNumber(new AsYouType("US").input(e.target.value));
                  }}
                  value={phoneNumber}
                  maxLength={16}
                />
              </div>
            </>
          )}
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
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col">
            <label className={formStyles.label} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className={
                actionData?.error ? formStyles.inputError : formStyles.input
              }
              autoComplete={
                isRegistration ? "new-password" : "current-password"
              }
            />
          </div>
        </div>

        {actionData?.error && (
          <FormError error={actionData.error} />
        )}
        {actionData?.success && (
          <div className={`${formStyles.success}`}>Success!</div>
        )}

        <button
          type="submit"
          className={formStyles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : buttonText}
        </button>

        <hr className="bg-purple shadow-dark h-1 rounded-sm drop-shadow-sm" />
        <AuthLink isRegistration={isRegistration} />
      </Form>
    </div>
  );
}
