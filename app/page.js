"use client";
import { useSession } from "next-auth/react";
import Header from "./(components)/Header";
import { TbBrandNextjs } from "react-icons/tb";
import { IoPerson } from "react-icons/io5";
import { FaDiscord, FaWhatsapp } from "react-icons/fa";
import Navbar from "./(components)/Navbar";
import Image from "next/image";
import MessageSent from "./(components)/MessageSent";
import MessageRecieved from "./(components)/MessageRecieved";
export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <main id="main" className=" relative">
      <Navbar />
      <section className=" ">
        <Header />
      </section>

      <div id="after-header">
        <div className="py-20">
          <section className="container mx-auto my-5 flex flex-col items-center p-3 md:flex-row md:px-10">
            <div className="mb-10 md:my-0 md:w-1/2">
              <h1 className="text-center text-3xl md:text-start md:text-7xl">
                Connect to your loved ones simply with an email!
              </h1>
              <div className="text-center text-xl md:text-start md:text-7xl">
                We use email for communication. Dont worry, it doesnt effect the
                real time behaviour of the app!
              </div>
            </div>
            <div class="relative mx-auto h-[600px] w-[300px] rounded-[2.5rem] border-[14px] border-gray-800 bg-gray-800 shadow-xl dark:border-gray-800">
              <div class="absolute left-1/2 top-0 h-[18px] w-[148px] -translate-x-1/2 rounded-b-[1rem] bg-gray-800"></div>
              <div class="absolute -start-[17px] top-[124px] h-[46px] w-[3px] rounded-s-lg bg-gray-800"></div>
              <div class="absolute -start-[17px] top-[178px] h-[46px] w-[3px] rounded-s-lg bg-gray-800"></div>
              <div class="absolute -end-[17px] top-[142px] h-[64px] w-[3px] rounded-e-lg bg-gray-800"></div>
              <div class="h-[572px] w-[272px] overflow-hidden rounded-[2rem] bg-white dark:bg-gray-800">
                <div className="bg-gradient-to-b from-gray-500 to-gray-700 p-5 pt-10  text-center">
                  Devansh
                </div>
                <div className="flex h-full flex-col justify-between bg-gray-700">
                  <div className="flex flex-col">
                    <div className="self-end">
                      <MessageSent content="Hello Bro" />
                    </div>
                    <div className="self-start">
                      <MessageRecieved content="Ayo" />
                    </div>
                    <div className="self-start">
                      <MessageRecieved content="Down for Fortnite tonight?" />
                    </div>
                    <div className="self-end">
                      <MessageSent content="Hell yeah" />
                    </div>
                  </div>
                  <input type="text" className="input" />
                </div>
              </div>
            </div>
          </section>
          <section className="p-3">
            <div className="container mx-auto ">
              <h1 className="heading text-center text-5xl">
                Chat with fluent UI!
              </h1>
              <h2 className="text-md text-balance text-center">
                Fast as lightning, sleek as Discord and easy as Whatsapp!
              </h2>
            </div>
          </section>
          <section className=" flex items-center justify-center p-5 py-12  md:p-10 md:px-14">
            <div className="flex w-3/4 flex-col items-center justify-center gap-3 md:flex-row">
              <div className="card bg-blue-900  md:w-1/3 ">
                <h2 className="text-xl">Fast as lightning!</h2>
                <div className="">
                  We use NEXTJS 14. Our website is fast as lightning!
                </div>
                <div className="">
                  <TbBrandNextjs className="h-full w-full" />
                </div>
              </div>
              <div className="card bg-gray-900 md:w-1/3">
                <h2 className="text-xl">Beautiful and sleek as Discord!</h2>
                <div className="">
                  Eye pleasing UI with the best dark theme there!
                </div>
                <div className="">
                  <FaDiscord className=" h-full w-full" />
                </div>
              </div>
              <div className="card bg-green-600 md:w-1/3">
                <h2 className="text-xl">Easy as Whatsapp!</h2>
                <div className="">
                  Just sign in, add contacts email, and you are good to go!
                </div>
                <div>
                  <FaWhatsapp className="h-full w-full" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
