import { Link, useNavigate } from "react-router";
import { useSession } from "~/context/SessionProvider";
import logo from "../logo.png";

export default function Nav() {
  // todo: navigate to '/signin' if no user || '/profile' with user
  // todo: style user button for active/inactive user session
  const navigate = useNavigate();
  // const { user } = useOutletContext<OutletContext>();
  const { session } = useSession();

  return (
    <nav className="grid grid-cols-5 items-center border-b-2 border-dark p-2 sm:px-10">
      <Link className="flex gap-4 text-left" to="/">
        <img
          src={logo}
          className="max-w-16 justify-self-center md:justify-self-start"
          alt="Divine Studio Logo"
        />
        <div className="hidden self-center text-center font-cherry md:block md:text-2xl">
          Divine Studio
        </div>
      </Link>
      <div className="col-span-3 text-center font-cherry text-3xl font-bold">
        <div className="self-center font-cherry text-sm tracking-widest md:hidden">
          Divine Studio
        </div>
        Breathwork
      </div>
      {/* <div className="font-cherry text-xs font-bold text-purple">
          This website is still a work in progress!
        </div> */}
      <button
        className="cursor-pointer text-right hover:underline"
        onClick={() =>
          session?.user ? navigate("/profile") : navigate("/signin")
        }
      >
        {session?.user ? session?.user.user_metadata.name : "User"}
      </button>
    </nav>
  );
}
