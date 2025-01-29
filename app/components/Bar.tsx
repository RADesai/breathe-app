import { Link, useLocation } from "react-router";

export default function Bar({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const location = useLocation();

  return (
    <div
      className={`mb-3 flex items-center justify-center p-2 text-xl font-bold uppercase tracking-widest ${className}`}
    >
      {location.pathname !== "/" && (
        <Link
          to="/"
          className="absolute left-6 md:left-12 text-xs font-medium hover:underline md:text-sm"
        >
          ←{" "}<span className="hidden md:inline">Back to</span>{" "}Home
        </Link>
      )}
      <span className="mx-auto">{title}</span>
    </div>
  );
}
