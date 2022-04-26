import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_DEV_API_KEY,
  authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
  projectId: process.env.REACT_APP_DEV_PROJECT_ID,
  storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_DEV_APP_ID,
  measurementId: process.env.REACT_APP_DEV_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { analytics, app, auth, db };

export function getCurrentUser(): Promise<
  Record<string, any> & { source: User }
> {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch user data from Firestore
        const q = query(
          collection(db, "users"),
          where("email", "==", auth.currentUser.email),
        );
        getDocs(q).then((snap) => {
          if (snap.docs.length === 1) {
            resolve({ ...snap.docs[0].data(), source: user });
          } else if (snap.docs.length > 1) {
            reject(new Error("Multiple users with same email found"));
          } else {
            reject(new Error("No user found"));
          }
        });
      } else {
        reject(new Error("No user is currently signed in"));
      }
    });
  });
}
