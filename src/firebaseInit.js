// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLBQkWJy1dk7P5HBseZ8hajYExq8cZD6w",
  authDomain: "blogging-app-7a068.firebaseapp.com",
  projectId: "blogging-app-7a068",
  storageBucket: "blogging-app-7a068.appspot.com",
  messagingSenderId: "764552684152",
  appId: "1:764552684152:web:0a841c79fe34261bcf438d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
