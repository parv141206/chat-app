"use client";
import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { signIn } from "next-auth/react";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function Page() {
  const [text, setText] = useState("Chit Chatz!");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Convert FormData to an object
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    try {
      const res = await signIn("credentials", {
        ...formDataObj,
        redirect: false,
      });
      console.log(res);
      if (res.error !== undefined && res.error !== null) {
        alert("Wrong username or password");
      } else {
        window.location.href = "/chat";
      }
    } catch (error) {
      alert("Nah bro");
      alert(error);
    }
  };
  useEffect(() => {
    var tl = gsap.timeline({ defaults: { duration: 2, ease: "none" } });

    tl.to("#scramble-2", {
      duration: 1,
      text: {
        value: text,
        chars: "lowerCase",
        revealDelay: 0,
        tweenLength: false,
      },
    });
  }, [text]);
  return (
    <div className="login  flex h-full min-h-screen items-center p-5">
      <div className="container mx-auto flex items-center justify-between md:flex-row-reverse md:px-10">
        <div className="md:1/2 ">
          <div id="scramble-2" className="text-balance text-7xl font-extrabold">
            Lets do it!
          </div>
        </div>
        <div className="md:1/2 flex items-center justify-center">
          <form onSubmit={handleSubmit}>
            <div className="card m-10 flex flex-col gap-1 rounded-3xl p-5 backdrop-blur-lg">
              <div className="text-center text-xl">Login</div>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="input"
              />
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" className="input" />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="input"
              />
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
