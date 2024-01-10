import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7lkJJFQuqBJLBPsKd-LS2Kh0AajYR3TQ",
  authDomain: "project1-ed601.firebaseapp.com",
  databaseURL: "https://project1-ed601-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "project1-ed601",
  storageBucket: "project1-ed601.appspot.com",
  messagingSenderId: "251097120489",
  appId: "1:251097120489:web:bddc074e6e4a934b233a78"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);