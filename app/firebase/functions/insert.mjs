import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase.mjs";

export const insertMessage = async (message, nickname) => {
  const docRef = await addDoc(collection(db, "messages"), message);
  const docRef2 = await addDoc(collection(db, "nicknames"), {
    email: message.to_email,
    nickname: nickname,
  });
  console.log("Document written with ID: ", docRef.id);
};
export const insertMessageNormal = async (message) => {
  const docRef = await addDoc(collection(db, "messages"), message);
  console.log("Document written with ID: ", docRef.id);
};
