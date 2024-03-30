"use client";
import { fetchMessagesFromToEmail } from "@/app/firebase/functions/fetchUsers";
import { CurrentEmailContext } from "@/app/layout";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getDateAsId } from "../../../utils/getDateAsId";

const socket = io("http://localhost:5000");

export default function Page({ params }) {
  const [currentEmail, setCurrentEmail] = useContext(CurrentEmailContext);
  const [messages, setMessages] = useState([]);
  const { data: session } = useSession();

  function generateRoomId(email1, email2) {
    const sortedEmails = [email1, email2].sort();
    const roomId = sortedEmails.join("-");
    return roomId;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    const date = getDateAsId();
    if (session && session.user && currentEmail) {
      const id = generateRoomId(session.user.email, currentEmail);
      const newMessage = {
        id: date,
        from_email: session.user.email,
        to_email: currentEmail,
        content: message,
        roomId: id,
      };
      socket.emit("send_message", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add the message to state
      e.target.message.value = "";
    }
  };

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      console.log("AAAAAAA GAYA ", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  });
  useEffect(() => {
    if (session && session.user && currentEmail) {
      const id = generateRoomId(session.user.email, currentEmail);
      socket.emit("init", id);

      const fetch = async () => {
        const data = await fetchMessagesFromToEmail(
          session.user.email,
          currentEmail,
        );
        setMessages(data);
      };
      fetch();
    }
  }, [currentEmail, session]);

  // Define renderMessages outside of useEffect
  const renderMessages = () => {
    const sortedMessages = messages.sort((a, b) => a.time - b.time);
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
      <br />
      <form onSubmit={handleSubmit} action="">
        <input
          placeholder="Enter message"
          name="message"
          id="message"
          type="text"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
