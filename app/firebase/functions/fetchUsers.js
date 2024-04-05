import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const messagesRef = collection(db, "messages");
const usersRef = collection(db, "messages");
const nicknamesRef = collection(db, "nicknames");

export const fetchMessagesFromEmail = async (email) => {
  // Query for messages where the provided email is either the sender or the recipient
  const qFrom = query(messagesRef, where("from_email", "==", email));
  const qTo = query(messagesRef, where("to_email", "==", email));

  // Fetch messages where the provided email is the sender
  const querySnapshotFrom = await getDocs(qFrom);
  const usersDataFrom = querySnapshotFrom.docs.map((doc) => doc.data());

  // Fetch messages where the provided email is the recipient
  const querySnapshotTo = await getDocs(qTo);
  const usersDataTo = querySnapshotTo.docs.map((doc) => doc.data());

  // Combine data from both queries
  const combinedData = [...usersDataFrom, ...usersDataTo];
  console.log(combinedData);
  // Extract unique emails from both sets of messages
  const uniqueEmails = new Set([
    ...usersDataFrom.map((user) => user.from_email),
    ...usersDataFrom.map((user) => user.to_email),
    ...usersDataTo.map((user) => user.from_email),
    ...usersDataTo.map((user) => user.to_email),
  ]);
  console.log("Unique emails: ", uniqueEmails);
  const contactsWithNicknames = await Promise.all(
    Array.from(uniqueEmails).map(async (contactEmail) => {
      const nicknameQuery = query(
        nicknamesRef,
        where("email", "==", contactEmail),
        where("for", "==", email),
      );
      const nicknameSnapshot = await getDocs(nicknameQuery);
      const nicknameDoc = nicknameSnapshot.docs[0]; // Assuming each email has a unique nickname
      return {
        email: contactEmail,
        nickname: nicknameDoc ? nicknameDoc.data().nickname : null,
      };
    }),
  );

  // Include nicknames in the response
  const res = {
    contactsWithNicknames: contactsWithNicknames,
    userData: combinedData,
  };

  return res;
};

export const fetchMessagesFromToEmail = async (emailFrom, emailTo) => {
  const q1 = query(
    usersRef,
    where("from_email", "==", emailFrom),
    where("to_email", "==", emailTo),
  );
  const querySnapshot1 = await getDocs(q1);

  const q2 = query(
    usersRef,
    where("from_email", "==", emailTo),
    where("to_email", "==", emailFrom),
  );
  const querySnapshot2 = await getDocs(q2);

  const usersData1 = querySnapshot1.docs.map((doc) => doc.data());
  const usersData2 = querySnapshot2.docs.map((doc) => doc.data());
  const combinedData = [...usersData1, ...usersData2];

  console.log(combinedData);

  return combinedData;
};
export const insertMessage = async (message, nickname, forEmail) => {
  const docRef = await addDoc(collection(db, "messages"), message);
  const docRef2 = await addDoc(collection(db, "nicknames"), {
    email: message.to_email,
    nickname: nickname,
    for: forEmail,
  });
  console.log("Document written with ID: ", docRef.id);
};
export const validateUser = async (email, password) => {
  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("email", "==", email),
    where("password", "==", password),
  );
  const querySnapshot = await getDocs(q);
  const usersData = querySnapshot.docs.map((doc) => doc.data());
  return usersData;
};
export const insertNickname = async (email, nickname, forEmail) => {
  const docRef = await addDoc(collection(db, "nicknames"), {
    email: email,
    nickname: nickname,
    for: forEmail,
  });
  console.log("Document written with ID: ", docRef.id);
};
