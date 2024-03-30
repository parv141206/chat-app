export const insertMessage = async (message) => {
  const docRef = await addDoc(collection(db, "messages"), message);
  console.log("Document written with ID: ", docRef.id);
};
