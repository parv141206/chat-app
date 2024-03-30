import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const usersRef = collection(db, "messages");
const nicknamesRef = collection(db, "nicknames");
export const fetchMessagesFromEmail = async (email) => {
  console.log(email);
  const q = query(usersRef, where("from_email", "==", email));
  const querySnapshot = await getDocs(q);

  const usersData = querySnapshot.docs.map((doc) => doc.data());

  console.log(usersData);
  let res = { contacts: [] };
  usersData.forEach((user) => {
    if (!res["contacts"].includes(user.to_email)) {
      res["contacts"].push(user.to_email);
    }
  });

  // Fetch nicknames for each contact
  const contactsWithNicknames = await Promise.all(
    res.contacts.map(async (contactEmail) => {
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
  res["contactsWithNicknames"] = contactsWithNicknames;

  res["userData"] = usersData;
  console.log(res);
  return res;
};

export const fetchMessagesToEmail = async (email) => {
  const q = query(usersRef, where("to_email", "==", email));
  const querySnapshot = await getDocs(q);

  const usersData = querySnapshot.docs.map((doc) => doc.data());

  console.log(usersData);

  return usersData;
};
