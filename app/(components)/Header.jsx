"use client";
import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Header = () => {
  const [text, setText] = useState("Sign In!");
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      setText("See chats!");
    } else {
      setText("Sign In!");
    }
  }, [session]);
  return (
    <>
      <section className="hidden md:block">
        <span className="span"></span>
        <span className="span"></span>
        <span className="span"></span>
        <span className="span"></span>
        <span className="span"></span>
        <span className="span"></span>
        <span className="span"></span>
        <span className="span"></span>
        <span className="span"></span>
        <span className="span"></span>
      </section>
      <div className="flex h-screen items-center justify-center">
        <div className="flex  flex-col gap-3">
          <div className="text-xl">Chatz</div>
          <div className="text-5xl md:text-7xl">Express😊😆</div>
          <div className="text-5xl md:text-7xl">🎉🤞your</div>
          <div className="text-5xl md:text-7xl">feelings👀✨</div>
          <div className="text-end text-3xl">
            <Link href="/chat">
              <button className="m-3 rounded-xl bg-indigo-400 px-3 py-1 drop-shadow-lg">
                {text}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
