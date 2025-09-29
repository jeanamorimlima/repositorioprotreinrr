import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOR19tnPPw-EMoShYZpWAJ5dTADmXGxzI",
  authDomain: "trainsmart-wbfjp.firebaseapp.com",
  projectId: "trainsmart-wbfjp",
  storageBucket: "trainsmart-wbfjp.firebasestorage.app",
  messagingSenderId: "737404477652",
  appId: "1:737404477652:web:6d82a395fad8007740db41"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app); // <-- Adicione esta linha!