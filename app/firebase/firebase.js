import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyCJ948cjlqTb-bKd6oF6ZsL4KQQWf3fCYs",
  authDomain: "nodeman-chat-app.firebaseapp.com",
  projectId: "nodeman-chat-app",
  storageBucket: "nodeman-chat-app.appspot.com",
  messagingSenderId: "316647598800",
  appId: "1:316647598800:web:4dfc4e170517545817ccd5",
  measurementId: "G-XDCR0WWWP2",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
