import AddNickname from "@/app/(components)/Add/AddNickname";
import React from "react";

export default function page({ params }) {
  return (
    <div>
      <AddNickname email={params.nickname} />
    </div>
  );
}
