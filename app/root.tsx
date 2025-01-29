import { Route } from ".react-router/types/app/+types/root";
import {
  isRouteErrorResponse,
  Links,
  LinksFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import stylesheet from "~/tailwind.css?url";

import { SessionProvider } from "./context/SessionProvider";
import { getSupabaseServer } from "./db/supabaseServer";
import { Session } from "@supabase/supabase-js";
import { sessionCookie } from "./db/cookies";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Catamaran:wght@400;700&family=Cherry+Swash:wght@400;700&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
  { rel: "icon", href: "/favicon.ico" },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Breathwork App" },
    { name: "Breathwork by Divine Studio", content: "Take a Breath" },
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      name: "description",
      content:
        "Breathwork - A tool to support mindful ways to take a pause, relax, and center yourself.",
    },
  ];
};

export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");
  const accessToken = await sessionCookie.parse(cookieHeader);

  if (!accessToken) {
    console.log("<root loader> No access token found, returning null session");
    return { session: null };
  }

  const supabaseServer = getSupabaseServer(request);
  const { data, error } = await supabaseServer.auth.getUser(accessToken);

  if (error || !data.user) {
    console.log("<root loader> Invalid or expired session");
    return { session: null };
  }

  return { session: { user: data.user } };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <ScrollRestoration />
        <Scripts />
      </head>
      <body className="bg-lightPink font-catamaran text-dark">{children}</body>
    </html>
  );
}

type LoaderData = {
  session?: Session;
};

export default function App() {
  const { session } = useLoaderData<LoaderData>();

  return (
    <SessionProvider serverSession={session}>
      {/* <GoogleOneTap /> */}
      <Outlet />
    </SessionProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "Sorry! The requested page could not be found. We are still under construction so please forgive us!"
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
