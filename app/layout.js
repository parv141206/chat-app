"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { createContext, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
const inter = Inter({ subsets: ["latin"] });
export const ThemeContext = createContext("dark");
export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("dark");
  return (
    <SessionProvider>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <html lang="en" className={`${theme} overflow-x-hidden`}>
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
            className={`${inter.className} ${
              theme === "dark"
                ? "bg-slate-950 text-teal-50"
                : "bg-teal-50 text-teal-950"
            }`}
          >
            {children}
          </body>
        </html>
      </ThemeContext.Provider>
    </SessionProvider>
  );
}
