import { Link, useLocation, useNavigate } from "react-router";
import { useSession } from "~/context/SessionProvider";
import logo from "../logo.webp";

const UserOutlineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-6 text-dark transition-colors duration-300 hover:text-purple"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);
const UserFilledIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6 text-purple"
  >
    <path
      fillRule="evenodd"
      d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export default function Nav() {
  const navigate = useNavigate();
  const { session } = useSession();
  const location = useLocation();
  const isProfile = location.pathname === "/profile";

  return (
    <nav className="grid grid-cols-5 items-center border-b-2 border-dark px-4 py-1 sm:px-10">
      <Link className="flex space-x-4 text-left" to="/">
        <div className="w-16">
          <img
            src={logo}
            className="max-w-16 justify-self-center md:justify-self-start"
            alt="Divine Studio Logo"
            width={64}
            height={64}
          />
        </div>
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
      <div className="text-right">
        <button
          className="cursor-pointer text-xs hover:underline"
          onClick={() =>
            session?.user ? navigate("/profile") : navigate("/signin")
          }
        >
          {session?.user ? (
            isProfile ? (
              <UserFilledIcon />
            ) : (
              <UserOutlineIcon />
            )
          ) : (
            "Login"
          )}
        </button>
      </div>
    </nav>
  );
}
