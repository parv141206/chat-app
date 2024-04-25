"use client";
import React, { useEffect, useState, useCallback, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchMessagesFromEmail } from "../../firebase/functions/fetchUsers.js";
import { useSession } from "next-auth/react";
import { ContactEmailsContext, CurrentEmailContext } from "@/app/layout";
import Loading from "@/app/(components)/Loading";
import { IoMenu } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
export default function Layout({ children }) {
  const [loading, setLoading] = useState(true);
  const [contactsWithNicknames, setContactsWithNicknames] = useState([]);
  const path = usePathname();
  const { data: session } = useSession();
  const [contactEmails, setContactEmails] = useContext(ContactEmailsContext);
  const [currentEmail, setCurrentEmail] = useContext(CurrentEmailContext);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentEmailBuffer, setCurrentEmailBuffer] = useState("");
  const setContactEmailsContext = useCallback(
    (data) => {
      let temp = [];
      const cachedData = localStorage.getItem("contactEmails");
      if (false) {
        temp = JSON.parse(cachedData);
        setContactEmails(temp);
      } else {
        data.forEach((contact) => {
          if (!temp.includes(contact.email)) {
            temp.push(contact.email);
          }
        });
        setContactEmails(temp);
        localStorage.setItem("contactEmails", JSON.stringify(temp));
      }
    },
    [setContactEmails],
  );

  const fetch = useCallback(async () => {
    if (session && session.user) {
      const email = session.user.email;
      if (email) {
        const cachedData = localStorage.getItem("contactsWithNicknames");
        if (false) {
          setContactsWithNicknames(JSON.parse(cachedData));
          setContactEmailsContext(JSON.parse(cachedData));
          setCurrentEmail(JSON.parse(cachedData)[0].email);
          setLoading(false);
        } else {
          const data = await fetchMessagesFromEmail(email);
          console.log("Fetched messages: ", data);
          setContactsWithNicknames(data.contactsWithNicknames);
          setContactEmailsContext(data.contactsWithNicknames);
          localStorage.setItem(
            "contactsWithNicknames",
            JSON.stringify(data.contactsWithNicknames),
          );
          setLoading(false);
        }
      }
    }
  }, [session, setContactEmailsContext, setCurrentEmail]);

  useEffect(() => {
    setCurrentEmailBuffer(localStorage.getItem("currentEmailBuffer"));
    fetch();
  }, [fetch]);

  return (
    <div className="min-h-screen  md:flex">
      <div className="sticky  left-0 top-0 flex w-full backdrop-blur-3xl md:w-fit md:dark:bg-slate-950">
        <ul className=" sticky top-0  hidden flex-col items-center justify-between  border-e border-slate-500 bg-slate-950  p-5 md:flex   md:h-screen">
          <div className="flex flex-col items-center justify-center gap-3">
            <Link href={`/`}>
              <FaHome className="mx-3 text-center text-3xl" />
            </Link>
            <li>
              <Link href="/chat/add/contact">
                <div className="rounded-full bg-transparent text-center text-3xl">
                  +
                </div>
              </Link>
            </li>
          </div>
          <Link href="/profile">Profile</Link>
        </ul>

        <ul className="top-0 w-full  overflow-hidden px-1 md:sticky md:h-screen  md:py-5">
          <div className="sticky top-0 flex w-full  flex-col items-center justify-center p-3 md:relative md:flex-col">
            <div className="flex w-full items-center justify-between">
              <h1 className="text-start text-xl font-bold md:p-0">
                Contacts
                <div className="hidden md:block">
                  <div className="flex text-sm">
                    <span className="mx-1">|</span>
                    {session && session.user && session.user.email}
                  </div>
                </div>
              </h1>
              <div className="text-xl md:hidden">
                <IoMenu
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                />
              </div>
            </div>
            <div className="sticky top-0 block border-slate-100 border-opacity-25   p-3  text-center backdrop-blur-xl md:top-0 md:hidden  md:border-b  md:p-5">
              {/* {localStorage &&
            localStorage.getItem("currentEmailBuffer") &&
            localStorage.getItem("currentEmailBuffer")} */}
              {currentEmailBuffer}
            </div>
          </div>
          <div
            className={`${isSidebarExpanded ? " max-h-[90%] overflow-scroll overflow-x-hidden" : "hidden max-h-[90%]  overflow-scroll overflow-x-hidden md:block"}`}
          >
            <ul className="  flex flex-col items-center justify-between  border-e border-slate-500 bg-slate-950  p-5 md:hidden   md:h-screen">
              <div className="flex flex-col items-center justify-center gap-3">
                <Link href={`/`}>
                  <FaHome className="mx-3 text-center text-3xl" />
                </Link>
                <li>
                  <Link href="/chat/add/contact">
                    <div className="rounded-full bg-transparent text-center text-3xl">
                      +
                    </div>
                  </Link>
                </li>
              </div>
              <Link href="/profile">Profile</Link>
            </ul>
            {loading ? (
              <div className="m-5 p-5">
                <Loading />
              </div>
            ) : (
              contactsWithNicknames.map((contact, index) => (
                <>
                  <li
                    key={contact.email}
                    className={`m-5 border-b border-slate-900 p-2 ${
                      decodeURIComponent(path.split("/")[2]) ===
                        contact.email ||
                      decodeURIComponent(path.split("/")[2]) ===
                        contact.nickname
                        ? "rounded-lg border-0 dark:bg-indigo-900"
                        : ""
                    }`}
                  >
                    {contact.nickname === null ? (
                      <Link
                        onClick={() => {
                          localStorage.setItem(
                            "currentEmailBuffer",
                            contact.email,
                          );
                          setCurrentEmail(contact.email);
                        }}
                        href={`/chat/${contact.email.trim()}`}
                      >
                        <div className="">
                          <span className="p-1 dark:text-slate-500">@</span>
                          {contact.email}
                          <Link
                            href={`/chat/add/nickname/${contact.email.trim()}`}
                          >
                            <button className="m-1 rounded-xl p-2 dark:bg-indigo-800 ">
                              Add nickname!
                            </button>
                          </Link>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          localStorage.setItem(
                            "currentEmailBuffer",
                            contact.email,
                          );
                          setCurrentEmail(contact.email);
                        }}
                        href={`/chat/${contact.nickname.trim()}`}
                      >
                        <span className="p-1 dark:text-slate-500">#</span>
                        {contact.nickname}
                        <br />
                        <div className="dark:text-slate-500">
                          <span className="p-1 dark:text-slate-500">@</span>
                          {contact.email}
                        </div>
                      </Link>
                    )}
                  </li>
                </>
              ))
            )}
          </div>
        </ul>
      </div>
      <div
        className={` h-screen w-full flex-col overflow-y-scroll md:flex ${isSidebarExpanded ? "hidden md:block" : ""}`}
      >
        <div className="sticky top-0 hidden border-slate-100   border-opacity-25  p-5 text-center backdrop-blur-xl md:top-0  md:block  md:border-b">
          {/* {localStorage &&
            localStorage.getItem("currentEmailBuffer") &&
            localStorage.getItem("currentEmailBuffer")} */}
          {currentEmailBuffer}
        </div>
        {children}
      </div>
    </div>
  );
}
