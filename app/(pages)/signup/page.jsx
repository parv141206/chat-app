"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import cryptoRandomString from "crypto-random-string";
import { getCookie, setCookie } from "cookies-next";
import cuid from "cuid";
import sendEmail from "@/app/_utils/email";
import { addNewUser } from "@/app/_utils/addNewUser";
export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const handleSubmit = async () => {
    const randomNumber = cryptoRandomString({ length: 4, type: "numeric" });

    await sendEmail(email, randomNumber);
    setCookie("verificationCode", randomNumber);
    setVerificationCodeSent(true);
  };
  const handleCodeVerification = async () => {
    if (verificationCode === getCookie("verificationCode")) {
      setIsVerified(true);
      const data = {
        id: cuid(),
        username: name,
        email: email,
        password: password,
      };
      addNewUser(data);
      signIn("credentials", { email, password });
    }
  };
  return (
    <div className="bg-indigo-100 dark:bg-indigo-950">
      <div className="container mx-auto  flex min-h-screen items-center justify-center gap-10 ">
        <div className="flex w-3/4 flex-col rounded-3xl bg-indigo-200 md:flex-row dark:bg-indigo-900">
          <div className="m-10 flex w-1/2  flex-col">
            <div className="font-montserrat text-7xl font-bold">Chatz</div>
            <div className="text-3xl">Signin now to chat!</div>
          </div>
          <div className="flex flex-col gap-3 rounded-none bg-white p-5 md:w-1/2  md:rounded-e-3xl dark:bg-slate-900">
            {verificationCodeSent ? (
              <>
                {isVerified ? (
                  <></>
                ) : (
                  <div className="text-3xl text-red-600">Not Verified</div>
                )}
                <label className="label" htmlFor="code">
                  Verification Code
                </label>
                <input
                  className="input"
                  onChange={(e) => setVerificationCode(e.target.value)}
                  type="text"
                />
                <button
                  value="Signin"
                  onClick={() => {
                    handleCodeVerification();
                  }}
                >
                  Signin
                </button>
              </>
            ) : (
              <>
                <label className="label" htmlFor="name">
                  Name
                </label>
                <input
                  className="input"
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                />
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
                <button value="Signup" onClick={handleSubmit}>
                  Signup
                </button>
                <div className="flex justify-between">
                  <label className="" htmlFor=" no-account">
                    Already have an account?
                  </label>
                  <Link href="/signin">
                    <button value="Signup" className="label">
                      Signin
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
