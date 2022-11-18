import { useEffect, useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

import UserContext from "../user-context";
import { auth } from "../firebase-config";
import Layout from "../components/Layout";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function LoginForm({ type }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter("");

  function handleSignup(event) {
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h3>{capitalizeFirstLetter(type)}</h3>
      <form
        className="d-flex justify-content-center flex-column"
        style={{
          width: "350px",
        }}
        onSubmit={handleSignup}
      >
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required={true}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required={true}
          />
        </div>
        {error !== "" && <div className="text-danger mb-3">{error}</div>}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default function Login() {
  const [type, setType] = useState("student");
  const user = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
      return;
    }
  }, [user, router]);

  return (
    <Layout className="h-100 d-flex flex-column justify-content-center align-items-center">
      <div className="mt-3 d-flex flex-column justify-content-center align-items-center">
        <h2>Login</h2>
        <div className="d-flex">
          <div>
            <button
              className="m-3 p-2 btn btn-secondary"
              onClick={() => {
                setType("student");
              }}
            >
              Student
            </button>
            <button
              className="m-3 p-2 btn btn-secondary"
              onClick={() => {
                setType("college");
              }}
            >
              College
            </button>
            <button
              className="m-3 p-2 btn btn-secondary"
              onClick={() => {
                setType("corporate");
              }}
            >
              Corporate
            </button>
          </div>
        </div>
      </div>
      {type === "student" && <LoginForm type="student" />}
      {type === "college" && <LoginForm type="college" />}
      {type === "corporate" && <LoginForm type="corporate" />}
    </Layout>
  );
}
