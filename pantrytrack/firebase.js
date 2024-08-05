// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  'apiKey': process.env.FIREBASE_API_KEY,
  'authDomain': process.env.FIREBASE_AUTH_DOMAIN,
  'projectId': process.env.FIREBASE_PROJECT_ID,
'  storageBucket': process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "616803325185",
  appId: "1:616803325185:web:22a692fe04cfdcda367700"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);