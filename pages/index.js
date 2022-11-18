import { useContext } from "react";
import Link from "next/link";

import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";
import UserContext from "../user-context";

export default function Home() {
  const user = useContext(UserContext);
  return (
    <Layout className={styles.container}>
      {user?.type === "student" && (
        <div>
          <Link className="m-3 btn btn-secondary" href="/resource">
            View resources
          </Link>
        </div>
      )}
      {user?.type === "corporate" && (
        <div>
          <Link className="m-3 btn btn-secondary" href="/hire">
            Hire student
          </Link>
        </div>
      )}
      {user?.type === "college" && (
        <div>
          <Link className="m-3 btn btn-secondary" href="/approve">
            Approve offer
          </Link>
          <Link className="m-3 btn btn-secondary" href="/resource">
            View resources
          </Link>
          <Link className="m-3 btn btn-secondary" href="/resource/upload">
            Upload resource
          </Link>
        </div>
      )}
      {!user && (
        <div className="m-3">
          Create an account to view and manage resources and placements for your
          company, college or students!
        </div>
      )}
    </Layout>
  );
}
