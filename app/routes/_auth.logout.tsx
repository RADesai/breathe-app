import { getSupabaseServer } from "~/db/supabaseServer";

export async function action({ request }: { request: Request }) {
  console.log("logout.action");
  try {
    console.log("logout.action try to signOut");
    const supabaseServer = getSupabaseServer(request);
    const { error } = await supabaseServer.auth.signOut();
    if (error) {
      console.log("logout.server-action signOut error");
      throw new Error(error.message);
    }

    console.log("logout.action signout complete, clear cookies && redirect to signin");
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/signin",
        "Set-Cookie": [
          "sb-access-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict",
          "sb-refresh-token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict",
        ].join(", "),
      },
    });
  } catch (err) {
    console.error("Logout failed:", err);
    return { error: err.message || "Something went wrong during logout." };
  }
}
