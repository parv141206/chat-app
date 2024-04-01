"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { fetchMessagesFromToEmail } from "@/app/firebase/functions/fetchUsers.js";
import { CurrentEmailContext } from "@/app/layout";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import { getDateAsId } from "../../../utils/getDateAsId";
import MessageSent from "@/app/(components)/MessageSent";
import MessageRecieved from "@/app/(components)/MessageRecieved";
import { FaArrowRight } from "react-icons/fa";
import FullPageLoading from "@/app/(components)/FullPageLoading";
const socket = io("http://localhost:5000");

export default function Page({ params }) {
  const [currentEmail, setCurrentEmail] = useContext(CurrentEmailContext);
  const [messages, setMessages] = useState([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [currentEmailBuffer, setCurrentEmailBuffer] = useState(
    localStorage.getItem("currentEmailBuffer") || "",
  );

  function generateRoomId(email1, email2) {
    const sortedEmails = [email1, email2].sort();
    const roomId = sortedEmails.join("-");
    return roomId;
  }

  useEffect(() => {
    if (session && session.user) {
      const id = generateRoomId(session.user.email, currentEmailBuffer);
      const storedMessages = localStorage.getItem(`messages-${id}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
      socket.on("recieve_message", (data) => {
        if (data.roomId === id) {
          setMessages((prevMessages) => {
            const messageExists = prevMessages.some(
              (msg) => msg.id === data.id,
            );
            if (!messageExists) {
              localStorage.setItem(
                `messages-${id}`,
                JSON.stringify([...prevMessages, data]),
              );
              return [...prevMessages, data];
            } else {
              return prevMessages;
            }
          });
        }
      });
    }

    return () => {
      socket.off("recieve_message");
    };
  }, [currentEmailBuffer, session]);

  useEffect(() => {
    if (session && session.user) {
      const id = generateRoomId(session.user.email, currentEmailBuffer);
      socket.emit("init", id);

      const fetch = async () => {
        setLoading(true);

        const data = await fetchMessagesFromToEmail(
          session.user.email,
          currentEmailBuffer,
        );
        if (data.length > 0) {
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, ...data].filter(
              (msg, index, self) =>
                index === self.findIndex((m) => m.id === msg.id),
            );
            return updatedMessages;
          });
        } else {
          setMessages([]);
        }
        setLoading(false);
      };
      fetch();
    }
  }, [currentEmailBuffer, session]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const message = e.target.message.value;
      const date = getDateAsId();
      if (session && session.user && currentEmailBuffer) {
        const id = generateRoomId(session.user.email, currentEmailBuffer);
        socket.emit("send_message", {
          id: date,
          from_email: session.user.email,
          to_email: currentEmailBuffer,
          content: message,
          roomId: id,
        });
        setMessages((prevMessages) => {
          const newMessage = {
            from_email: session.user.email,
            to_email: currentEmailBuffer,
            id: date,
            content: message,
          };
          const updatedMessages = [...prevMessages, newMessage];
          localStorage.setItem(
            `messages-${id}`,
            JSON.stringify(updatedMessages),
          );
          return updatedMessages;
        });
        e.target.message.value = "";
      }
    },
    [session, currentEmailBuffer],
  );

  const renderMessages = () => {
    const sortedMessages = [...messages].sort((a, b) => a.id - b.id);

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

  if (loading) {
    return <FullPageLoading />;
  }

  return (
    <div>
      My Post: {params.id} <br />
      Email: {currentEmailBuffer}
      <br />
      <div className="flex flex-col">{renderMessages()}</div>
      <br />
      <form
        className="sticky bottom-5 z-10 flex w-full gap-5 p-5"
        onSubmit={handleSubmit}
        action=""
      >
        <div className="input flex w-full items-center justify-around gap-3 backdrop-blur-2xl">
          <input
            className="input w-full rounded-none"
            placeholder="Enter message"
            name="message"
            id="message"
            type="text"
          />
          <button className="w-fit text-xl font-extrabold" type="submit">
            <FaArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
}
