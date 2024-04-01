"use client";
import React, { useEffect, useState, useCallback, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchMessagesFromEmail } from "../../firebase/functions/fetchUsers.js";
import { useSession } from "next-auth/react";
import { ContactEmailsContext, CurrentEmailContext } from "@/app/layout";
import Loading from "@/app/(components)/Loading";

export default function Layout({ children }) {
  const [loading, setLoading] = useState(true);
  const [contactsWithNicknames, setContactsWithNicknames] = useState([]);
  const path = usePathname();
  const { data: session } = useSession();
  const [contactEmails, setContactEmails] = useContext(ContactEmailsContext);
  const [currentEmail, setCurrentEmail] = useContext(CurrentEmailContext);

  const setContactEmailsContext = useCallback(
    (data) => {
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
    },
    [setContactEmails],
  );

  const fetch = useCallback(async () => {
    if (session && session.user) {
      const email = session.user.email;
      if (email) {
        const cachedData = localStorage.getItem("contactsWithNicknames");
        if (cachedData) {
          setContactsWithNicknames(JSON.parse(cachedData));
          setContactEmailsContext(JSON.parse(cachedData));
          setCurrentEmail(JSON.parse(cachedData)[0].email);
          setLoading(false);
        } else {
          const data = await fetchMessagesFromEmail(email);
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
      <div className="left-0 top-0 flex w-full flex-col p-3 md:w-fit dark:bg-blue-950">
        <ul className="sticky top-5">
          <h1 className="text-xl font-bold">Contacts</h1>
          {loading ? (
            <div className="m-5 p-5">
              <Loading />
            </div>
          ) : (
            contactsWithNicknames.map((contact, index) => (
              <li
                key={contact.email}
                className={`m-2 border-b border-slate-900 p-2 ${path.split("/")[2] === contact.email.trim() ? "rounded-lg border-0 dark:bg-indigo-900" : ""}`}
              >
                <Link
                  onClick={() => {
                    localStorage.setItem("currentEmailBuffer", contact.email);
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
              </li>
            ))
          )}
          <li>
            <Link href="/chat/add/contact">
              <div className="btn-secondary bg-green-800 text-center">+</div>
            </Link>
          </li>
        </ul>
      </div>
      <div className="w-full md:p-10">{children}</div>
    </div>
  );
}
