import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "daily-pay-web.firebaseapp.com",
  projectId: "daily-pay-web",
  storageBucket: "daily-pay-web.appspot.com",
  messagingSenderId: "955881293158",
  appId: "1:955881293158:web:870b1958709f85fd5e74a7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
