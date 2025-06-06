// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "revents-pm.firebaseapp.com",
  databaseURL:
    "https://revents-pm-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "revents-pm",
  storageBucket: "revents-pm.firebasestorage.app",
  messagingSenderId: "557753991031",
  appId: "1:557753991031:web:b068c7a7e3460732b96b72",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);
export const fb = getDatabase(app);
