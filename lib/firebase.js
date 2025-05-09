// /lib/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBKy0DeQiugFG-pGGjFPk5agJcQQmt6uAg",
  authDomain: "blog-c7659.firebaseapp.com",
  databaseURL: "https://blog-c7659-default-rtdb.firebaseio.com",
  projectId: "blog-c7659",
  storageBucket: "blog-c7659.firebasestorage.app",
  messagingSenderId: "691995168013",
  appId: "1:691995168013:web:aa7442d41a378c92faf444"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
