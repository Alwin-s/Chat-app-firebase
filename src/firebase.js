
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCegW1iR0rbmkp4jAqACBTH3x-nwoN_hn0",
  authDomain: "chat-42721.firebaseapp.com",
  projectId: "chat-42721",
  storageBucket: "chat-42721.appspot.com",
  messagingSenderId: "679658829388",
  appId: "1:679658829388:web:fdfaf61f8aa79f849826e9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();