// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBgfIg5O2OUCMaX8qqtE6Xn9tj9SDgrDf0",
  authDomain: "carelink-fd979.firebaseapp.com",
  projectId: "carelink-fd979",
  storageBucket: "carelink-fd979.firebasestorage.app",
  messagingSenderId: "740049485540",
  appId: "1:740049485540:web:8dd50024bdefff614af6f1",
  measurementId: "G-KHQ786072H"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
