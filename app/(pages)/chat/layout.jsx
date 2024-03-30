"use client";
import React, { useEffect, useState, useCallback, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchMessagesFromEmail } from "@/app/firebase/functions/fetchUsers";
import { useSession } from "next-auth/react";
import { ContactEmailsContext, CurrentEmailContext } from "@/app/layout";

export default function Layout({ children }) {
  const [contactsWithNicknames, setContactsWithNicknames] = useState([]);
  const path = usePathname();
  const { data: session } = useSession();
  const [contactEmails, setContactEmails] = useContext(ContactEmailsContext);
  const [currentEmail, setCurrentEmail] = useContext(CurrentEmailContext);
  /**
   * setContactEmailsContext
   * @param {Array} data
   */
  const setContactEmailsContext = (data) => {
    let temp = [];
    const cachedData = localStorage.getItem("contactEmails");
    if (cachedData) {
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
    console.log(temp);
  };
  // Memoize the fetch function
  const fetch = useCallback(async () => {
    if (session && session.user) {
      const email = session.user.email;
      if (email) {
        const cachedData = localStorage.getItem("contactsWithNicknames");
        if (cachedData) {
          console.log(cachedData);
          setContactsWithNicknames(JSON.parse(cachedData));
          setContactEmailsContext(JSON.parse(cachedData));
          setCurrentEmail(JSON.parse(cachedData)[0].email);
        } else {
          const data = await fetchMessagesFromEmail(email);
          console.log(data);
          setContactsWithNicknames(data.contactsWithNicknames);
          setContactEmailsContext(data.contactsWithNicknames);
          console.log(data.contactsWithNicknames[0].email);
          setCurrentEmail(data.contactsWithNicknames[0].email);
          // Update local storage with new data
          localStorage.setItem(
            "contactsWithNicknames",
            JSON.stringify(data.contactsWithNicknames),
          );
        }
      }
    }
  }, [session]); // Dependency array

  useEffect(() => {
    fetch();
  }, [fetch]); // Use the memoized fetch function

  return (
    <div className="min-h-screen gap-3 md:flex">
      <div className="flex flex-col p-3 md:w-fit dark:bg-blue-950">
        <ul>
          <h1 className="text-xl font-bold">Contacts</h1>
          {contactsWithNicknames.map((contact, index) => (
            <li
              key={contact.email}
              className={`m-2 border-b border-slate-900 p-2 ${path.split("/")[2] === contact.email.trim() ? "rounded-lg border-0 dark:bg-indigo-900" : ""}`}
            >
              <Link
                onClick={() => setCurrentEmail(contact.email)}
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
            </li>
          ))}
        </ul>
      </div>
      <div>{children}</div>
    </div>
  );
}
