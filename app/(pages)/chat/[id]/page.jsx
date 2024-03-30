"use client";
import { fetchMessagesFromToEmail } from "@/app/firebase/functions/fetchUsers";
import { CurrentEmailContext } from "@/app/layout";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";

export default function Page({ params }) {
  const [currentEmail, setCurrentEmail] = useContext(CurrentEmailContext);
  const [messages, setMessages] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetch = async () => {
      if (session && session.user) {
        const data = await fetchMessagesFromToEmail(
          session.user.email,
          currentEmail,
        );
        setMessages(data);
        console.log(data);
      }
    };
    fetch();
  }, [currentEmail, session]);

  // Define renderMessages outside of useEffect
  const renderMessages = () => {
    // Sort messages based on the 'time' field in ascending order
    const sortedMessages = messages.sort((a, b) => a.time - b.time);

    // Now you can use sortedMessages for rendering or further processing
    console.log("Sorted messages:", sortedMessages);
    return sortedMessages.map((message) =>
      message.from_email === session.user.email ? (
        <div key={message.id} className="text-right">
          {message.content}
        </div>
      ) : (
        <div key={message.id} className="text-left">
          {message.content}
        </div>
      ),
    );
  };

  return (
    <div>
      My Post: {params.id} <br />
      Email: {currentEmail}
      <br />
      {renderMessages()}
    </div>
  );
}
