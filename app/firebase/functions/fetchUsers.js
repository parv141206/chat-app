import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const usersRef = collection(db, "messages");
const nicknamesRef = collection(db, "nicknames");
export const fetchMessagesFromEmail = async (email) => {
  console.log(email);
  // Query for messages where the from_email matches the provided email
  const qFrom = query(usersRef, where("from_email", "==", email));
  const querySnapshotFrom = await getDocs(qFrom);

  // Query for messages where the to_email matches the provided email
  const qTo = query(usersRef, where("to_email", "==", email));
  const querySnapshotTo = await getDocs(qTo);

  // Combine data from both queries
  const usersDataFrom = querySnapshotFrom.docs.map((doc) => doc.data());
  const usersDataTo = querySnapshotTo.docs.map((doc) => doc.data());
  const combinedData = [...usersDataFrom, ...usersDataTo];

  console.log(combinedData);

  // Fetch nicknames for each contact involved in the messages
  console.log("DATA FROM: ", usersDataFrom);
  console.log("DATA TO: ", usersDataTo);
  const contacts = [
    ...new Set(
      [...usersDataFrom, ...usersDataTo].map((user) => user.from_email),
    ),
  ];
  console.log(contacts);
  const contactsWithNicknames = await Promise.all(
    contacts.map(async (contactEmail) => {
      console.log(contactEmail);
      const nicknameQuery = query(
        nicknamesRef,
        where("email", "==", contactEmail),
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

  console.log(res);
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
export const insertMessage = async (message, nickname) => {
  const docRef = await addDoc(collection(db, "messages"), message);
  const docRef2 = await addDoc(collection(db, "nicknames"), {
    email: message.to_email,
    nickname: nickname,
  });
  console.log("Document written with ID: ", docRef.id);
};
