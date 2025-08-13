import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  type User
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDnDEtL-XY3-V-mpPQlW-zgAeRzGnNUsI",
  authDomain: "autonexus-fe3f6.firebaseapp.com",
  projectId: "autonexus-fe3f6",
  storageBucket: "autonexus-fe3f6.appspot.com",
  messagingSenderId: "808011613522",
  appId: "1:808011613522:web:47c8182b3c564f8172a68b",
  measurementId: "G-0S7KC4P4XF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, db, googleProvider, type User };
export default app;