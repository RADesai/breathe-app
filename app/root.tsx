import { Route } from ".react-router/types/app/+types/root";
import {
  isRouteErrorResponse,
  Links,
  LinksFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration
} from "react-router";
import stylesheet from "~/tailwind.css?url";

import { SessionProvider } from "./context/SessionProvider";

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
    { title: "Breathe App" },
    { name: "Breathe", content: "Take a Breath" },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ScrollRestoration />
        <Scripts />
      </head>
      <body className="bg-lightPink font-catamaran text-dark">{children}</body>
    </html>
  );
}

export default function App() {
  // const { user } = useLoaderData<LoaderData>();
  // console.log("<root> current user:", user);
  // console.log("<root> user.metadata", user?.user_metadata?.name);

  return (
    <SessionProvider>
      {/* <GoogleOneTap /> */}
      {/* <Outlet context={{ user }} /> */}
      <Outlet />
    </SessionProvider>
  );
}

// export type OutletContext = { user: LoaderData["user"] };

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
