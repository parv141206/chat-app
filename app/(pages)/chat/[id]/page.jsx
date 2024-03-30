"use client";
import React, { useContext, useEffect, useState } from "react";
import { fetchMessagesFromToEmail } from "@/app/firebase/functions/fetchUsers";
import { CurrentEmailContext } from "@/app/layout";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import { getDateAsId } from "../../../utils/getDateAsId";
import MessageSent from "@/app/(components)/MessageSent";
import MessageRecieved from "@/app/(components)/MessageRecieved";
import { FaArrowRight } from "react-icons/fa";
const socket = io("http://localhost:5000");

export default function Page({ params }) {
  const [currentEmail, setCurrentEmail] = useContext(CurrentEmailContext);
  const [messages, setMessages] = useState([]);
  const { data: session, status } = useSession(); // Destructure status from useSession

  function generateRoomId(email1, email2) {
    const sortedEmails = [email1, email2].sort();
    const roomId = sortedEmails.join("-");
    return roomId;
  }

  useEffect(() => {
    // Load messages from localStorage on component mount
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    socket.on("recieve_message", (data) => {
      console.log("Received message: ", data);
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some((msg) => msg.id === data.id);
        if (!messageExists) {
          localStorage.setItem(
            "messages",
            JSON.stringify([...prevMessages, data]),
          );
          return [...prevMessages, data];
        } else {
          return prevMessages;
        }
      });
    });

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      socket.off("recieve_message");
    };
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    if (session && session.user && currentEmail) {
      const id = generateRoomId(session.user.email, currentEmail);
      socket.emit("init", id);

      const fetch = async () => {
        const data = await fetchMessagesFromToEmail(
          session.user.email,
          currentEmail,
        );
        setMessages((prevMessages) => {
          // Merge fetched messages with localStorage messages, avoiding duplicates
          const updatedMessages = [...prevMessages, ...data].filter(
            (msg, index, self) =>
              index === self.findIndex((m) => m.id === msg.id),
          );
          return updatedMessages;
        });
      };
      fetch();
    }
  }, [currentEmail, session]); // This effect runs when currentEmail or session changes

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    const date = getDateAsId();
    if (session && session.user && currentEmail) {
      const id = generateRoomId(session.user.email, currentEmail);
      socket.emit("send_message", {
        id: date,
        from_email: session.user.email,
        to_email: currentEmail,
        content: message,
        roomId: id,
      });
      setMessages((prevMessages) => {
        const newMessage = {
          from_email: session.user.email,
          to_email: currentEmail,
          id: date,
          content: message,
        };
        const updatedMessages = [...prevMessages, newMessage];
        localStorage.setItem("messages", JSON.stringify(updatedMessages)); // Update localStorage here
        return updatedMessages;
      });
      e.target.message.value = "";
    }
  };

  const renderMessages = () => {
    const sortedMessages = messages.sort((a, b) => a.time - b.time);
    return sortedMessages.map((message) =>
      message.from_email === session.user.email ? (
        <div key={message.id} className="self-end">
          <MessageSent content={message.content} time={message.id} />
        </div>
      ) : (
        <div key={message.id} className="self-start">
          <MessageRecieved content={message.content} time={message.id} />
        </div>
      ),
    );
  };

  // Conditional rendering based on session status
  if (status === "loading") {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <div>
      My Post: {params.id} <br />
      Email: {currentEmail}
      <br />
      <div className="flex flex-col">{renderMessages()}</div>
      <br />
      <form
        className="sticky bottom-5  z-10   flex w-full gap-5 p-5 "
        onSubmit={handleSubmit}
        action=""
      >
        <div className="input flex w-full items-center justify-around  gap-3 backdrop-blur-2xl">
          <input
            className="input w-full  rounded-none  "
            placeholder="Enter message"
            name="message"
            id="message"
            type="text"
          />
          <button className=" w-fit text-xl  font-extrabold" type="submit">
            <FaArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
}
