import { useEffect } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router";
import Bar from "~/components/Bar";

import Nav from "~/components/Nav";
import { OutletContext } from "~/root";

// ? todo: delete _auth and just use profile as the root auth component?
export default function Index() {
  const { user } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  console.log("_auth -> user:", user);

  useEffect(() => {
    console.log("<_auth> useEffect:", user);
    if (
      !user &&
      location.pathname !== "/signin" &&
      location.pathname !== "/signup"
    ) {
      console.log("<_auth> useEffect, !user");
      // Redirect to Sign In page if no user session exists
      // navigate('/signin', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col justify-center">
      <Nav />
      <Bar title="Profile" className="bg-purple text-white" />
      <div className="flex flex-wrap justify-center gap-1 self-center overflow-scroll px-2 pt-4 md:w-2/3">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
}
