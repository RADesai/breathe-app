import { Route } from '.react-router/types/app/+types/root';
import {
  ClerkProvider
} from '@clerk/react-router';
import { rootAuthLoader } from '@clerk/react-router/ssr.server';
import {
  isRouteErrorResponse,
  Links,
  LinksFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration
} from 'react-router';
import stylesheet from '~/tailwind.css?url';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Catamaran:wght@400;700&family=Cherry+Swash:wght@400;700&display=swap'
  },
  { rel: 'stylesheet', href: stylesheet },
  { rel: 'icon', href: '/favicon.ico' }
];

export const meta: MetaFunction = () => {
  return [
    { title: 'Breathe App' },
    { name: 'Breathe', content: 'Take a Breath' }
  ];
};

export async function loader(args: Route.LoaderArgs) {
  return rootAuthLoader(args);
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='text-dark bg-[#e9cc94] font-catamaran'>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <ClerkProvider
      loaderData={loaderData}
      signUpFallbackRedirectUrl='/'
      signInFallbackRedirectUrl='/'
    >
      <main>
        <Outlet />
      </main>
    </ClerkProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
