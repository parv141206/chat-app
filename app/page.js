"use client";
import { useSession } from "next-auth/react";
import Header from "./(components)/Header";
import { SiSocketdotio } from "react-icons/si";
import { IoPerson } from "react-icons/io5";
export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <main id="main" className=" relative">
      <section className=" ">
        <div className="h-[200vh]">
          <div className="sticky top-0 h-screen">
            <Header className="header sticky" />
          </div>
        </div>
      </section>
      <div id="after-header">
        <div className="my-40">
          <section className="p-3">
            <div className="container mx-auto ">
              <h1 className="heading text-center text-5xl">
                Chat with fluent UI!
              </h1>
            </div>
          </section>
          <section className="my-12 flex items-center justify-center p-5  md:p-10 md:px-14">
            <div className="w-1/2 text-balance">
              <div className="heading text-5xl">
                Message instantly, WE USE{" "}
                <span className="text-green-400">WEB SOCKETS!</span>
              </div>
            </div>
            <div className="flex w-1/2 items-center justify-end text-center">
              <SiSocketdotio className="text-center text-[20rem] text-green-400" />
            </div>
          </section>
          <section className="my-12 flex flex-row-reverse items-center justify-center p-5  md:p-10 md:px-14">
            <div className="w-1/2 text-balance text-end">
              <div className="heading text-5xl">
                Create a profile in a minute, you just need{" "}
                <span className="text-green-400">an Email!</span>
              </div>
            </div>
            <div className="flex w-1/2 items-center justify-start  text-center">
              <IoPerson className="text-center text-[20rem] text-green-400" />
            </div>
          </section>
          <section className=" my-12 flex h-screen items-center justify-center p-5  md:p-10 md:px-14">
            <div className="heading sticky top-0 text-balance text-5xl">
              FAST AF with <span className="text-green-400">NEXTjs 14</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
