import { createClient } from "@supabase/supabase-js";
import { parse } from "cookie";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

export const getSupabaseServer = (request: Request) => {
  // Extract the "sb-access-token" from cookies
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = parse(cookieHeader);
  const accessToken = cookies["sb-access-token"];
  const refreshToken = cookies["sb-refresh-token"]; // Ensure the refresh token is managed

  console.log("getSupabaseServer refreshToken:", refreshToken);
  console.log("^^ getSupabaseServer refreshToken ^^");

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        cookie: cookieHeader,
      },
    },
  });
};
