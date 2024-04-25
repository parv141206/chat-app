"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { createContext, useState } from "react";
import { SessionProvider } from "next-auth/react";
const inter = Inter({ subsets: ["latin"] });
export const ThemeContext = createContext("dark");
export const ContactEmailsContext = createContext([]);
export const CurrentEmailContext = createContext("");
export default function RootLayout({ children }) {
  const [contactEmails, setContactEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [theme, setTheme] = useState("dark");
  return (
    <SessionProvider>
      <ContactEmailsContext.Provider value={[contactEmails, setContactEmails]}>
        <CurrentEmailContext.Provider value={[currentEmail, setCurrentEmail]}>
          <ThemeContext.Provider value={{ theme, setTheme }}>
            <html
              lang="en"
              data-theme
              className={`${theme} font-montserrat overflow-x-hidden`}
            >
              <head>
                <title>Chatz</title>
                <meta
                  name="description"
                  content="Chat with your friends with ease!"
                />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
              </head>
              <body
                className={` ${
                  theme === "dark"
                    ? "bg-slate-900 text-teal-50"
                    : "bg-teal-50 text-teal-950"
                }`}
              >
                {children}
              </body>
            </html>
          </ThemeContext.Provider>
        </CurrentEmailContext.Provider>
      </ContactEmailsContext.Provider>
    </SessionProvider>
  );
}
