import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyCJ5ET7IJo6vsQxFf-NOyl4iMhXmyrZhHg",
  authDomain: "placement-platform-d9335.firebaseapp.com",
  projectId: "placement-platform-d9335",
  storageBucket: "placement-platform-d9335.appspot.com",
  messagingSenderId: "895588401167",
  appId: "1:895588401167:web:5b49e07e23a4f70cbca37a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
