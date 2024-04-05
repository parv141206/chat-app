"use client";
import { insertNickname } from "@/app/firebase/functions/fetchUsers";
import { useSession } from "next-auth/react";
import React from "react";

export default function AddNickname(props) {
  const { email } = props;
  const { data: session } = useSession();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(confirm("Sure?"));
    if (
      confirm(`Are you sure with the nickname: ${e.target.nickname.value} `)
    ) {
      if (session.user && session.user.email) {
        const nickname = e.target.nickname.value;
        const email = e.target.email.value;

        const foruser = session.user.email;
        console.log(nickname, email, foruser);
        insertNickname(email, nickname, foruser);
      }
    }
  };
  return (
    <div>
      <div className="md:w-1/2">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit} action="">
          <label htmlFor="nickname">Nickname</label>
          <input className="input" type="text" name="nickname" id="nickname" />
          <label htmlFor="email">Email</label>
          <input
            className="input"
            type="email"
            name="email"
            id="email"
            value={decodeURIComponent(email)}
          />
          <button className="btn-secondary" type="submit">
            Add Contact
          </button>
        </form>
      </div>
    </div>
  );
}
