"use client";
import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Header = () => {
  const [text, setText] = useState("Chat with your friends with ease!");

  useEffect(() => {
    var tl = gsap.timeline({ defaults: { duration: 2, ease: "none" } });

    tl.to("#scramble", {
      duration: 3,
      text: {
        value: text,
        chars: "lowerCase",
        revealDelay: 0,
        tweenLength: false,
      },
    });

    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".header",
        start: "top top",
        end: "+=1000",
        scrub: 1,
        pin: true,
        markers: false,
      },
    });
    const tl3 = gsap.timeline({
      defaults: {
        ease: "bounce",
        duration: 2,
      },
    });
    // Adjusted scaling animation for smooth scaling down
    tl3.fromTo("#scramble", { scale: 2 }, { scale: 1 });
    tl2.to(".box", { yPercent: 250, duration: 1 });
    tl2.to(".box", { rotation: 90, duration: 1 });
    tl2.to(".box", { xPercent: 350, duration: 1 });
  }, [text]); // Include text in the dependency array if it can change

  return (
    <>
      <div className="scramble-text flex h-screen items-center justify-center ">
        <div
          id="scramble"
          className="text-balance text-center text-5xl font-extrabold md:w-1/2"
        >
          XOXOXXOXO XOXOXXO XOXOXOXO XOXOXO
        </div>
        <div className="box absolute -z-10 h-48 w-48 rounded-2xl bg-blue-800"></div>
      </div>
    </>
  );
};

export default Header;
