import "../styles/globals.css";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

import { auth, db } from "../firebase-config";
import UserContext from "../user-context";

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        const user = userDoc.data();
        setUser(user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return <div className="m-3">Loading...</div>;
  }
  return (
    <UserContext.Provider value={user}>
      {<Component {...pageProps} />}
    </UserContext.Provider>
  );
}
