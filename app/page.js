"use client";
import { useSession } from "next-auth/react";
import Header from "./(components)/Header";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <main>
      <section className=" ">
        <div className="h-[200vh]">
          <div className="sticky top-0 h-screen">
            <Header className="header sticky" />
          </div>
        </div>
      </section>
      <section>
        <div className="container mx-auto my-40">
          <h1 className="heading text-5xl">Chat with fluent UI!</h1>
        </div>
      </section>
    </main>
  );
}
