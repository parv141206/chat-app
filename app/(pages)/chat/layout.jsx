"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchMessagesFromEmail } from "@/app/firebase/functions/fetchUsers";
import { useSession } from "next-auth/react";

export default function Layout({ children }) {
  const [contactsWithNicknames, setContactsWithNicknames] = useState([]);
  const path = usePathname();
  const { data: session } = useSession();

  // Memoize the fetch function
  const fetch = useCallback(async () => {
    if (session && session.user) {
      const email = session.user.email;
      if (email) {
        const cachedData = localStorage.getItem("contactsWithNicknames");
        if (cachedData) {
          setContactsWithNicknames(JSON.parse(cachedData));
        } else {
          const data = await fetchMessagesFromEmail(email);
          console.log(data);
          setContactsWithNicknames(data.contactsWithNicknames);
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
              <Link href={`${contact.nickname.trim()}`}>
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
