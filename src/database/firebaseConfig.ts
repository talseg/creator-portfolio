import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBsoRkMDnFFo0ybfcTjOsrqToMK-dUDegs",
    authDomain: "creator-portfolio-f2b93.firebaseapp.com",
    projectId: "creator-portfolio-f2b93",
    storageBucket: "creator-portfolio-f2b93.firebasestorage.app",
    messagingSenderId: "128025780099",
    appId: "1:128025780099:web:292c8107f4baa7f2a9e0b6"
};

const app = initializeApp(firebaseConfig);

//export const db = getFirestore(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(), // allows multiple tabs to use the same cache
  }),
});

export const storage = getStorage(app);
export const auth = getAuth(app);