"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const { data: session } = useSession();
  useEffect(() => {
    setEmail(session?.user?.email);
  }, [session]);
  return (
    <div>
      <div className="container mx-auto flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-start justify-start gap-3">
          <div className="text-center text-xl md:w-1/2 md:text-start md:text-7xl">
            Profile
          </div>
          <div className="text-md flex md:text-3xl">
            📧Your email:
            <div className="text-md px-3 text-indigo-200 md:text-3xl">
              {" "}
              {email}
            </div>
          </div>
          <button className="rounded-lg bg-indigo-600 px-3 py-1 text-white ">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
