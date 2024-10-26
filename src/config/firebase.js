// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9ugmz3S7bOweI0fgZELJHwoFCHED3phE",
  authDomain: "vite-contact-1c4ef.firebaseapp.com",
  projectId: "vite-contact-1c4ef",
  storageBucket: "vite-contact-1c4ef.appspot.com",
  messagingSenderId: "546259235426",
  appId: "1:546259235426:web:81e2a3a04bf1935dd7573b",
  measurementId: "G-9QH5F0PX62"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db=getFirestore(app)