import { Link } from "react-router";
import { formStyles } from "~/utils/styles";

export const PleaseLogin = ({ message }: { message: string }) => {
    return (
      <div className="flex flex-col items-center">
        <p className="text-center font-cherry text-sm">
          Please{" "}
          <Link className={formStyles.link} to="/signin">
            Login
          </Link>{" "}
          {message}
        </p>
      </div>
    );
}
