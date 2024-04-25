"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn("credentials", { email, password });
    setEmail("");
    setPassword("");
  };
  return (
    <div className="bg-indigo-100 dark:bg-indigo-950">
      <div className="container mx-auto  flex min-h-screen items-center justify-center gap-10 ">
        <div className="flex w-3/4 flex-col rounded-3xl bg-indigo-200 md:flex-row dark:bg-indigo-900">
          <div className="m-10 flex w-1/2  flex-col">
            <div className="font-montserrat text-7xl font-bold">Chatz</div>
            <div className="text-3xl">Signin now to chat!</div>
          </div>
          <form
            action=""
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 rounded-none bg-white p-5 md:w-1/2  md:rounded-e-3xl dark:bg-slate-900"
          >
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              className="input"
              onChange={(e) => setEmail(e.target.value)}
              type="text"
            />
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              className="input"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <button
              type="submit"
              // onClick={() => {
              //   signIn("credentials", { email, password }, { redirect: true });
              // }}
            >
              Login
            </button>
            <div className="flex justify-between">
              <label className="" htmlFor=" no-account">
                Dont have an account?
              </label>
              <Link href="/signup">
                <button value="Signup" className="label">
                  Signup
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
