import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useSession } from "next-auth/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Header = () => {
  const [text, setText] = useState("Chat with your friends with ease!");
  const { data: session } = useSession();

  useEffect(() => {
    console.log("Animation setup started"); // Debugging log

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

    const tl3 = gsap.timeline({
      defaults: {
        ease: "bounce",
        duration: 2,
      },
    });

    const tl4 = gsap.timeline({
      scrollTrigger: {
        trigger: ".header",
        start: "top top",
        end: "+=1000",
        scrub: 1,
        pin: true,
        markers: false,
      },
    });
    tl4.to("#img-1", {
      scale: 2,
      opacity: 0,
      duration: 1,
    });
    const tl5 = gsap.timeline({
      scrollTrigger: {
        trigger: ".header",
        start: "top top",
        end: "+=1000",
        scrub: 1,
        pin: true,
        markers: false,
      },
    });
    tl5.to(".img-2", {
      scale: 1.2,
      duration: 1,
    });
    tl4.to("#scramble", {
      scale: 1.2,
      duration: 1,
    });
    console.log("Animation setup completed"); // Debugging log
  }, [text]);

  return (
    <>
      <div id="img-1" className="img-1"></div>
      <div className="img-2"></div>
      <div className="first ">
        <div className="scramble-text flex h-screen flex-col items-center justify-center gap-5 ">
          <div
            id="scramble"
            className="elegant text-balance text-center text-5xl font-extrabold md:w-1/2"
          >
            XOXOXXOXO XOXOXXO XOXOXOXO XOXOXO
          </div>
          {session && session.user ? (
            <div className="btn-form">
              <Link href="/chat">
                <div className="btn-text ">CHAT!</div>
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <div className="btn-text">GET STARTED!</div>
            </Link>
          )}
        </div>
      </div>
      {/* Your content here */}
    </>
  );
};

export default Header;
