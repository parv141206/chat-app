import React from "react";
import { IoIosChatboxes } from "react-icons/io";
export default function page() {
  return (
    <div className="flex h-screen  flex-col items-center justify-center p-3">
      <div className="text-9xl opacity-85">
        <IoIosChatboxes />
      </div>
      <div className="text-center text-3xl md:text-start ">
        👀 Just select the contact to chat!
      </div>
      <div className="text-center text-xl md:text-start">
        You can add new contacts using the + button!
      </div>
    </div>
  );
}
