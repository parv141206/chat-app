"use client";
import React, { useEffect, useState, useCallback, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchMessagesFromEmail } from "../../firebase/functions/fetchUsers.js";
import { useSession } from "next-auth/react";
import { ContactEmailsContext, CurrentEmailContext } from "@/app/layout";
import Loading from "@/app/(components)/Loading";
import { IoMenu } from "react-icons/io5";
export default function Layout({ children }) {
  const [loading, setLoading] = useState(true);
  const [contactsWithNicknames, setContactsWithNicknames] = useState([]);
  const path = usePathname();
  const { data: session } = useSession();
  const [contactEmails, setContactEmails] = useContext(ContactEmailsContext);
  const [currentEmail, setCurrentEmail] = useContext(CurrentEmailContext);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
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
    fetch();
  }, [fetch]);

  return (
    <div className="min-h-screen gap-3 md:flex">
      <div className="sticky left-0 top-0  flex w-full flex-col  md:w-fit dark:bg-slate-950">
        <ul className="  sticky top-0 px-1 py-5 md:h-screen">
          <div className="sticky top-0 flex items-center justify-between  px-3 md:relative md:flex-col">
            <h1 className="p-3  text-start  text-xl font-bold md:p-0">
              Contacts
              <div className="flex text-sm">
                <span className="mx-1">|</span>
                {session && session.user && session.user.email}
              </div>
            </h1>
            <div className="text-xl md:hidden">
              <IoMenu
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              />
            </div>
          </div>
          <div className={`${isSidebarExpanded ? "" : "hidden"}`}>
            {loading ? (
              <div className="m-5 p-5">
                <Loading />
              </div>
            ) : (
              contactsWithNicknames.map((contact, index) => (
                <li
                  key={contact.email}
                  className={`m-5 border-b border-slate-900 p-2 ${
                    decodeURIComponent(path.split("/")[2]) === contact.email ||
                    decodeURIComponent(path.split("/")[2]) === contact.nickname
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
              ))
            )}
            <li>
              <Link href="/chat/add/contact">
                <div className="btn-secondary bg-green-800 text-center">+</div>
              </Link>
            </li>
          </div>
        </ul>
      </div>
      <div className="w-full p-5  md:p-10">{children}</div>
    </div>
  );
}
