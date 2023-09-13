// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqshfC2rJ2a3P49QhEHAYTBtGXnXqJGsg",
  authDomain: "oauth-warehouseproject.firebaseapp.com",
  projectId: "oauth-warehouseproject",
  storageBucket: "oauth-warehouseproject.appspot.com",
  messagingSenderId: "160945891772",
  appId: "1:160945891772:web:982cd78e4540d47b7d23b9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
