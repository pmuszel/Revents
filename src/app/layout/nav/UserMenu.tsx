import { UserIcon } from "@heroicons/react/24/outline";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { PowerIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../../../lib/stores/store";
import { Link, useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase/firebase";

export default function UserMenu() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.account.user);

  const handleSignOut = async () => {
    // dispatch(signOut());
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="m-1 text-white text-xl font-semibold flex gap-3 items-center"
      >
        <div className="avatar">
          <div className="w-11 rounded-full">
            <img src={user?.photoURL || "/user.png"} alt="User Avatar" />
          </div>
        </div>
        <span>{user?.displayName}</span>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        <li>
          <Link
            className="flex gap-3 items-center"
            to={`/profiles/${user?.uid}`}
          >
            <UserIcon className="size-6" />
            My profile
          </Link>
        </li>
        <li>
          <div className="flex gap-3 items-center">
            <CalendarIcon className="size-6" />
            CreateEvent
          </div>
        </li>
        <div className="divider my-0"></div>
        <li onClick={() => handleSignOut()}>
          <div className="flex gap-3 items-center">
            <PowerIcon className="size-6 text-error" />
            Sign Out
          </div>
        </li>
      </ul>
    </div>
  );
}
