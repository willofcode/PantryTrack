// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  'apiKey': process.env.FIREBASE_API_KEY,
  authDomain: "hspantrytrack.firebaseapp.com",
  projectId: "hspantrytrack",
  storageBucket: "hspantrytrack.appspot.com",
  messagingSenderId: "616803325185",
  appId: "1:616803325185:web:22a692fe04cfdcda367700"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);