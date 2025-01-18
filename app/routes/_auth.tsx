import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Bar from "~/components/Bar";

import Nav from "~/components/Nav";
import { useSession } from "~/context/SessionProvider";

// ? todo: delete _auth and just use profile as the root auth component?
export default function Index() {
  // const { user } = useOutletContext<OutletContext>();
  const session = useSession();
  const navigate = useNavigate();
  console.log("_auth -> user:", session?.user);

  useEffect(() => {
    console.log("<_auth> useEffect:", session?.user);
    if (
      !session?.user &&
      location.pathname !== "/signin" &&
      location.pathname !== "/signup"
    ) {
      console.log("<_auth> useEffect, !session?.user");
      // Redirect to Sign In page if no session?.user session exists
      // navigate('/signin', { replace: true });
    }
  }, [session?.user, navigate]);

  return (
    <div className="flex flex-col justify-center">
      <Nav />
      <Bar title="Profile" className="bg-purple text-white" />
      <div className="flex flex-wrap justify-center gap-1 self-center overflow-scroll px-2 pt-4 md:w-2/3">
        <Outlet />
      </div>
    </div>
  );
}
