import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  onSnapshot,
  getDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  doc,
} from "firebase/firestore";

import Layout from "../components/Layout";
import UserContext from "../user-context";
import { db } from "../firebase-config";

async function onApprove(offer) {
  const pendingRef = doc(db, "pendingOffers", offer.id);
  const approvedRef = doc(db, "approvedOffers", offer.id);

  try {
    await setDoc(approvedRef, {
      role: offer.role,
      roleType: offer.roleType,
      studentId: offer.student.id,
      corporateId: offer.corporate.id,
      ctc: offer.ctc,
      collegeId: offer.collegeId,
    });
    await deleteDoc(pendingRef);
  } catch (err) {
    console.error(err);
  }
}

const Card = ({ offer, status }) => {
  return (
    <>
      <div className="card m-3" style={{ width: "20rem" }}>
        <div className="card-body">
          <h5 className="card-title">{offer.corporate.name}</h5>
          <h6 className="card-subtitle mb-2">
            {offer.student.name} ({offer.student.rollNo})
          </h6>
          <h6 className="card-subtitle mb-2 text-muted">
            {offer.student.roll}
          </h6>
          <p className="card-text">
            Company is offering {offer.ctc} CTC for {offer.role} role (
            {offer.roleType}).
          </p>
          {status === "pending" && (
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onApprove(offer);
                }}
              >
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Approve = () => {
  const [pendingOffers, setPendingOffers] = useState([]);
  const [approvedOffers, setApprovedOffers] = useState([]);
  const user = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.type !== "college") {
      router.push("/");
      return;
    }
  }, [user, router]);

  async function getHydratedOfferList(offerList) {
    const finalOfferList = [];

    for (const { studentId, corporateId, ...offer } of offerList) {
      const studentDoc = await getDoc(doc(db, "students", studentId));
      const corporateDoc = await getDoc(doc(db, "corporates", corporateId));

      finalOfferList.push({
        ...offer,
        student: studentDoc.data(),
        corporate: corporateDoc.data(),
      });
    }

    return finalOfferList;
  }

  useEffect(() => {
    if (!user) {
      return;
    }

    const q = query(
      collection(db, "pendingOffers"),
      where("collegeId", "==", user?.id)
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const pendingOffers = [];
      querySnapshot.forEach((doc) => {
        const { role, roleType, studentId, corporateId, collegeId, ctc } =
          doc.data();

        pendingOffers.push({
          id: doc.id,
          role,
          roleType,
          studentId,
          corporateId,
          collegeId,
          ctc,
        });
      });

      const offers = await getHydratedOfferList(pendingOffers);
      setPendingOffers(offers);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const q = query(
      collection(db, "approvedOffers"),
      where("collegeId", "==", user.id)
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const approvedOffers = [];
      querySnapshot.forEach((doc) => {
        const { role, roleType, studentId, corporateId, collegeId, ctc } =
          doc.data();
        approvedOffers.push({
          id: doc.id,
          role,
          roleType,
          studentId,
          corporateId,
          collegeId,
          ctc,
        });
      });

      const offers = await getHydratedOfferList(approvedOffers);
      setApprovedOffers(offers);
    });

    return unsubscribe;
  }, [user]);

  return (
    <Layout>
      <div className="d-flex mt-4 flex-column justify-content-center align-items-center">
        <h3>Pending Request</h3>
        <div className="d-flex mt-5 flex-wrap">
          {pendingOffers.map((offer) => {
            return <Card key={offer.id} offer={offer} status="pending" />;
          })}
        </div>
      </div>
      <div className="d-flex mt-4 flex-column justify-content-center align-items-center">
        <h3>Approved Request</h3>
        <div className="d-flex mt-5 flex-wrap">
          {approvedOffers.map((offer) => {
            return <Card key={offer.id} offer={offer} status="approved" />;
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Approve;
