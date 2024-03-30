"use client";
import { useSession } from "next-auth/react";
import Header from "./(components)/Header";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <main>
      <section className="">
        <Header className="header" />
      </section>
    </main>
  );
}
