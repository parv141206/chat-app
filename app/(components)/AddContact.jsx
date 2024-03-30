import { useSession } from "next-auth/react";
import React from "react";
import { getDateAsId } from "../utils/getDateAsId";
import { insertMessage } from "../firebase/functions/fetchUsers";

export default function AddContact() {
  const { data: session } = useSession();
  const handleSubmit = (e) => {
    e.preventDefault();
    const nickname = e.target.nickname.value;
    const email = e.target.email.value;
    console.log(nickname, email);
    const message = {
      from_email: session.user.email,
      to_email: email,
      content: "Hello, I'd like to add you as a contact",
      id: getDateAsId(),
    };
    insertMessage(message);
  };
  return (
    <div>
      <form onSubmit={handleSubmit} action="">
        <label htmlFor="nickname">Nickname</label>
        <input type="text" name="nickname" id="nickname" />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
        <button type="submit">Add Contact</button>
      </form>
    </div>
  );
}
