import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

export async function loader({ request }: { request: Request }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;
  const headers = new Headers();

  const supabaseServer = createServerClient(supabaseUrl, supabaseSecretKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          headers.append(
            "Set-Cookie",
            serializeCookieHeader(name, value, options),
          ),
        );
      },
    },
  });

  const { data, error } = await supabaseServer.auth.getSession();

  if (error || !data.session) {
    return { session: null };
  }

  return { session: data.session };
}
