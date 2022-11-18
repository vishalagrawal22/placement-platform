import Link from "next/link";
import { useContext } from "react";
import { signOut } from "firebase/auth";

import { auth } from "../../firebase-config";
import UserContext from "../../user-context";

export default function Layout({ children }) {
  const user = useContext(UserContext);
  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <header>
        <nav className="h-100 p-3 navbar navbar-light bg-light justify-content-between">
          <Link href="/" className="navbar-brand">
            Placement Platform
          </Link>
          {user ? (
            <div className="mr-sm-2 d-flex justify-content-center align-items-center">
              <div className="m-3">Welcome, {user.name}</div>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="mr-sm-2">
              <Link className="btn btn-secondary m-3" href="/login">
                Login
              </Link>
              <Link className="btn btn-secondary" href="/signup">
                Signup
              </Link>
            </div>
          )}
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}
