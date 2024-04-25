// "use client";
// import { useSession } from "next-auth/react";
// import Header from "./(components)/Header";
// import { TbBrandNextjs } from "react-icons/tb";
// import { IoPerson } from "react-icons/io5";
// import { FaDiscord, FaWhatsapp } from "react-icons/fa";
// export default function Home() {
//   const { data: session } = useSession();
//   console.log(session);

//   return (
//     <main id="main" className=" relative">
//       <section className=" ">
//         <div className="md:h-[200vh]">
//           <div className="sticky top-0 h-screen">
//             <Header className="header sticky" />
//           </div>
//         </div>
//       </section>
//       <div id="after-header">
//         <div className="py-40">
//           <section className="p-3">
//             <div className="container mx-auto ">
//               <h1 className="heading text-center text-5xl">
//                 Chat with fluent UI!
//               </h1>
//               <h2 className="text-md text-balance text-center">
//                 Fast as lightning, sleek as Discord and easy as Whatsapp!
//               </h2>
//             </div>
//           </section>
//           <section className=" flex items-center justify-center p-5 py-12  md:p-10 md:px-14">
//             <div className="flex w-3/4 flex-col items-center justify-center gap-3 md:flex-row">
//               <div className="card bg-blue-900  md:w-1/3 ">
//                 <h2 className="text-xl">Fast as lightning!</h2>
//                 <div className="">
//                   We use NEXTJS 14. Our website is fast as lightning!
//                 </div>
//                 <div className="">
//                   <TbBrandNextjs className="h-full w-full" />
//                 </div>
//               </div>
//               <div className="card bg-gray-900 md:w-1/3">
//                 <h2 className="text-xl">Beautiful and sleek as Discord!</h2>
//                 <div className="">
//                   Eye pleasing UI with the best dark theme there!
//                 </div>
//                 <div className="">
//                   <FaDiscord className=" h-full w-full" />
//                 </div>
//               </div>
//               <div className="card bg-green-600 md:w-1/3">
//                 <h2 className="text-xl">Easy as Whatsapp!</h2>
//                 <div className="">
//                   Just sign in, add contacts email, and you are good to go!
//                 </div>
//                 <div>
//                   <FaWhatsapp className="h-full w-full" />
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </main>
//   );
// }

// // Header
// import React, { useEffect, useState } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { TextPlugin } from "gsap/TextPlugin";
// import { useSession } from "next-auth/react";
// import Link from "next/link";

// gsap.registerPlugin(ScrollTrigger, TextPlugin);

// const Header = () => {
//   const [text, setText] = useState("Chat with your friends with ease!");
//   const { data: session } = useSession();

//   useEffect(() => {
//     console.log("Animation setup started"); // Debugging log

//     var tl = gsap.timeline({ defaults: { duration: 2, ease: "none" } });

//     tl.to("#scramble", {
//       duration: 3,
//       text: {
//         value: text,
//         chars: "lowerCase",
//         revealDelay: 0,
//         tweenLength: false,
//       },
//     });

//     const tl3 = gsap.timeline({
//       defaults: {
//         ease: "bounce",
//         duration: 2,
//       },
//     });

//     const tl4 = gsap.timeline({
//       scrollTrigger: {
//         trigger: ".header",
//         start: "top top",
//         end: "+=1000",
//         scrub: 4,
//         pin: true,
//         markers: false,
//       },
//     });
//     tl4.to("#img-1", {
//       scale: 2,
//       opacity: 0,
//       duration: 2,
//     });
//     const tl5 = gsap.timeline({
//       scrollTrigger: {
//         trigger: ".header",
//         start: "top top",
//         end: "+=1000",
//         scrub: 4,
//         pin: true,
//         markers: false,
//       },
//     });
//     tl5.to(".img-2", {
//       scale: 1.2,
//       duration: 1,
//     });
//     tl4.to("#scramble", {
//       scale: 1.2,
//       duration: 1,
//     });
//     console.log("Animation setup completed"); // Debugging log
//   }, [text]);

//   return (
//     <>
//       <div id="img-1" className="img-1 hidden md:absolute"></div>
//       <div className="img-2"></div>
//       <div className="first ">
//         <div className="scramble-text flex h-screen flex-col items-center justify-center gap-5 ">
//           <div
//             id="scramble"
//             className="elegant text-balance text-center text-5xl font-extrabold md:w-1/2"
//           >
//             XOXOXXOXO XOXOXXO XOXOXOXO XOXOXO
//           </div>
//           {session && session.user ? (
//             <div className="btn-form">
//               <Link href="/chat">
//                 <div className="btn-text ">CHAT!</div>
//               </Link>
//             </div>
//           ) : (
//             <Link href="/login">
//               <div className="btn-text">GET STARTED!</div>
//             </Link>
//           )}
//         </div>
//       </div>
//       {/* Your content here */}
//     </>
//   );
// };

// export default Header;
