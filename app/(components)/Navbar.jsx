"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
export default function Navbar() {
  const { data: session } = useSession();
  return (
    <div>
      <div className="fixed left-3 right-3  top-5 z-10 flex items-center justify-center px-5 font-bold md:left-0 md:right-0">
        <div className="btns dark:bg-midnight flex flex-col items-center gap-3 rounded-xl bg-white p-5  md:flex-row dark:bg-slate-800 ">
          <div className="text-3xl">Chatz</div>
          <div className="flex flex-row gap-3">
            <Link href="/chat">
              <div className="btn">Chat</div>
            </Link>

            <Link href="/profile">
              <div className="btn">Profile</div>
            </Link>
            {session ? (
              session.user ? (
                <Link href="/api/auth/signout">
                  <div className="btn">Signout</div>
                </Link>
              ) : (
                <Link href="/api/auth/signout">
                  <div className="btn">Signout</div>
                </Link>
              )
            ) : (
              <Link href="/login">
                <div className="btn">Sign In</div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
