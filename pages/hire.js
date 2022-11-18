import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import {
  query,
  where,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase-config";

import Layout from "../components/Layout";

import UserContext from "../user-context";

const Hire = () => {
  const user = useContext(UserContext);
  const router = useRouter();
  const [ctc, setCtc] = useState(0);
  const [role, setRole] = useState("");
  const [roleType, setRoleType] = useState("");
  const [college, setCollege] = useState("invalid");
  const [student, setStudent] = useState("invalid");
  const [studentChoices, setStudentChoices] = useState([]);
  const [collegeChoices, setCollegeChoices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.type !== "corporate") {
      router.push("/");
      return;
    }
  }, [user, router]);

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

  useEffect(() => {
    if (college !== "invalid") {
      const q = query(
        collection(db, "students"),
        where("college", "==", college)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const studentChoices = [];
        querySnapshot.forEach((doc) => {
          const { id, name, rollNo } = doc.data();
          studentChoices.push({ id, name, rollNo });
        });
        setStudentChoices(studentChoices);
      });

      return unsubscribe;
    }
  }, [college]);

  const clearForm = () => {
    setCtc(0);
    setCollege("invalid");
    setStudent("invalid");
    setRole("");
    setRoleType("FTE");
    setError("");
  };

  const handleHire = async (event) => {
    event.preventDefault();
    if (college === "invalid") {
      setError("College is required");
      return;
    }

    if (student === "invalid") {
      setError("Student is required");
      return;
    }

    const pendingOfferRef = collection(db, "pendingOffers");

    try {
      await addDoc(pendingOfferRef, {
        role,
        roleType,
        collegeId: college,
        studentId: student,
        corporateId: user?.id,
        ctc,
      });

      clearForm();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div className="d-flex mt-4 flex-column justify-content-center align-items-center">
        <h3>Hire Candidate</h3>
        <form
          className="d-flex justify-content-center flex-column"
          style={{
            width: "350px",
          }}
          onSubmit={handleHire}
        >
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <input
              type="text"
              className="form-control"
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
              }}
              required={true}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="roleType" className="form-label">
              Role Type
            </label>
            <select
              id="roleType"
              className="form-select"
              onChange={(event) => {
                setRoleType(event.target.value);
              }}
              value={roleType}
            >
              <option value={"fte"}>FTE</option>
              <option value={"intern"}>Intern</option>
            </select>
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
            <label htmlFor="college" className="form-label">
              Student
            </label>
            <select
              id="college"
              className="form-select"
              aria-label="Default select example"
              onChange={(event) => {
                setStudent(event.target.value);
              }}
              value={student}
              disabled={college === "invalid"}
            >
              <option value={"invalid"}>Choose student</option>
              {studentChoices &&
                studentChoices.map((studentChoice) => (
                  <option key={studentChoice.id} value={studentChoice.id}>
                    {studentChoice.name} ({studentChoice.rollNo})
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Cost To Company
            </label>
            <input
              type="number"
              className="form-control"
              id="name"
              value={ctc}
              onChange={(e) => {
                setCtc(e.target.value);
              }}
              min="0"
              required={true}
            />
          </div>
          {error !== "" && <div className="text-danger mb-3">{error}</div>}
          <button type="submit" className="btn btn-primary">
            Hire
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Hire;
