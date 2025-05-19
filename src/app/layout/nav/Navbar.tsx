import { Link, NavLink } from "react-router";
import UserMenu from "./UserMenu";
import { useAppSelector } from "../../../lib/stores/store";

export default function Navbar() {
  const user = useAppSelector((state) => state.account.user);
  const loading = useAppSelector((state) => state.firestore.loading);

  return (
    <header className="px-3 w-full fixed top-0 z-50 bg-gradient-to-r from-primary to-black">
      <div className="flex align-middle items-center px-10 mx-auto gap-6 cursor-pointer">
        <div className="h-12 text-white flex items-center gap-3 border-r-white border-r-2 my-3 pr-6">
          <NavLink
            to="/"
            className="text-2xl font-semibold text-white uppercase"
          >
            Re-vents
          </NavLink>
        </div>
        <nav className="flex gap-3 my-2 uppercase text-lg text-white">
          <NavLink to="/events" end>
            Events
          </NavLink>
          {/* <a onClick={() => dispatch(toggleForm(null))}>Create</a> */}
          <NavLink to="/createEvent">Create</NavLink>
        </nav>
        {loading && <span className="loading loading-lg text-white"></span>}
        <div className="flex align-middle ml-auto gap-3">
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-info">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline btn-info">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
