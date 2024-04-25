import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase.mjs";

export const addNewUser = async (data) => {
  const docRef = await addDoc(collection(db, "users"), data);
  return true;
};
