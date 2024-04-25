import AddNickname from "@/app/(components)/Add/AddNickname";
import React from "react";

export default function page({ params }) {
  return (
    <div className="p-5 md:p-0">
      <AddNickname email={params.nickname} />
    </div>
  );
}
