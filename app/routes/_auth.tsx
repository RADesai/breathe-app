import { Outlet } from "react-router";
import Bar from "~/components/Bar";

import Nav from "~/components/Nav";

export default function Index() {
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
