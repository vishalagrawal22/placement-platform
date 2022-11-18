import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { collection, query, onSnapshot } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

import UserContext from "../user-context";
import Layout from "../components/Layout";
import { auth, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function NameForm({ type }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter("");

  function handleSignup(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("passwords do not match!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        router.push("/");
        const typeDoc = doc(db, type + "s", user.uid);

        await setDoc(typeDoc, {
          id: user.uid,
          name,
          email,
        });

        const userDoc = doc(db, "users", user.uid);

        await setDoc(userDoc, {
          id: user.uid,
          type,
          name,
        });
      })
      .catch((error) => {
        console.error(error);
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
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="name"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            required={true}
          />
        </div>
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
          <div id="emailHelp" className="form-text">
            Companies and Colleges should use an authorised email like
            recruiting@google.com
          </div>
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
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
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

function StudentForm() {
  const type = "student";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [college, setCollege] = useState("invalid");
  const [collegeChoices, setCollegeChoices] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter("");

  useEffect(() => {
    const q = query(collection(db, "colleges"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const collegeChoices = [];
      querySnapshot.forEach((doc) => {
        collegeChoices.push({ id: doc.data().id, name: doc.data().name });
      });
      setCollegeChoices(collegeChoices);
    });

    return unsubscribe;
  }, []);

  async function handleSignup(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("passwords do not match!");
      return;
    }

    if (college === "invalid") {
      setError("choose a college");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const typeDoc = doc(db, type + "s", user.uid);

      await setDoc(typeDoc, {
        id: user.uid,
        name,
        email,
        college,
        rollNo,
      });

      const userDoc = doc(db, "users", user.uid);

      await setDoc(userDoc, {
        id: user.uid,
        name,
        type,
      });

      router.push("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
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
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="name"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
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
          />
          <div id="emailHelp" className="form-text">
            Companies and Colleges should use an authorised email like
            recruiting@google.com
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="rollNo" className="form-label">
            Roll No
          </label>
          <input
            type="text"
            className="form-control"
            id="rollNo"
            value={rollNo}
            onChange={(e) => {
              setRollNo(e.target.value);
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="college" className="form-label">
            College
          </label>
          <select
            id="college"
            className="form-select"
            aria-label="Default select example"
            onChange={(event) => {
              setCollege(event.target.value);
            }}
            value={college}
          >
            <option value={"invalid"}>Choose college</option>
            {collegeChoices &&
              collegeChoices.map((collegeChoice) => (
                <option key={collegeChoice.id} value={collegeChoice.id}>
                  {collegeChoice.name}
                </option>
              ))}
          </select>
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
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
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

export default function SignUp() {
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
        <h2>Signup</h2>
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
      {type === "student" && <StudentForm />}
      {type === "college" && <NameForm type="college" />}
      {type === "corporate" && <NameForm type="corporate" />}
    </Layout>
  );
}
