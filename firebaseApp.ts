import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyADg8sotsll4uBvoepB5rPcCdLokq9Vahk",
  authDomain: "note-ladder.firebaseapp.com",
  projectId: "note-ladder",
  storageBucket: "note-ladder.appspot.com",
  messagingSenderId: "379657944013",
  appId: "1:379657944013:web:c498a7835b7808533f2284",
};

initializeApp(firebaseConfig);
export const firebaseAuth = getAuth();
