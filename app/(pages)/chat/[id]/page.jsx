"use client";
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { fetchMessagesFromToEmail } from "@/app/firebase/functions/fetchUsers.js";
import { CurrentEmailContext } from "@/app/layout";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import { getDateAsId } from "../../../utils/getDateAsId";
import MessageSent from "@/app/(components)/MessageSent";
import MessageRecieved from "@/app/(components)/MessageRecieved";
import { FaArrowRight } from "react-icons/fa";
import FullPageLoading from "@/app/(components)/FullPageLoading";
const socket = io("http://192.168.31.183:5000");

export default function Page({ params }) {
  const [currentEmail, setCurrentEmail] = useContext(CurrentEmailContext);
  const [messages, setMessages] = useState([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [currentEmailBuffer, setCurrentEmailBuffer] = useState(
    localStorage.getItem("currentEmailBuffer") || "",
  );

  // Ref for the chat container
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  function generateRoomId(email1, email2) {
    const sortedEmails = [email1, email2].sort();
    const roomId = sortedEmails.join("-");
    return roomId;
  }

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom();
  });

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
        console.log(data);
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

  useEffect(() => {
    // Use setTimeout with a delay of 0 to ensure the scroll action is performed after the DOM update
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 0);
  }, [messages]); // Depend on messages state

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
    <div className="">
      <div className="m-3 md:m-10">
        <br />
        {/* Attach the ref to the chat container */}
        <div ref={chatContainerRef} className="flex flex-col overflow-y-auto">
          {renderMessages()}
        </div>
        <div ref={messagesEndRef} />
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
    </div>
  );
}
