"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { getDateAsId } from "../../utils/getDateAsId";
import { insertMessage } from "../../firebase/functions/fetchUsers.js";

export default function AddContact() {
  const { data: session } = useSession();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(confirm("Sure?"));
    if (
      confirm(
        `Are you sure, please check the email and nickname: @${e.target.email.value} #${e.target.nickname.value} `,
      )
    ) {
      const nickname = e.target.nickname.value;
      const email = e.target.email.value;
      console.log(nickname, email);
      const message = {
        from_email: session.user.email,
        to_email: email,
        content: "Hello, I'd like to add you as a contact",
        id: getDateAsId(),
      };

      insertMessage(message, nickname, session.user.email);
    }
  };
  return (
    <div className="md:w-1/2">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit} action="">
        <label htmlFor="nickname">Nickname</label>
        <input className="input" type="text" name="nickname" id="nickname" />
        <label htmlFor="email">Email</label>
        <input className="input" type="email" name="email" id="email" />
        <button className="btn-secondary" type="submit">
          Add Contact
        </button>
      </form>
    </div>
  );
}
