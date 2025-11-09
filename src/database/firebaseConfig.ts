import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBsoRkMDnFFo0ybfcTjOsrqToMK-dUDegs",
  authDomain: "creator-portfolio-f2b93.firebaseapp.com",
  projectId: "creator-portfolio-f2b93",
  storageBucket: "creator-portfolio-f2b93.firebasestorage.app",
  messagingSenderId: "128025780099",
  appId: "1:128025780099:web:292c8107f4baa7f2a9e0b6"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);