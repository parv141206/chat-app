import React from "react";
import Loading from "./Loading";

export default function FullPageLoading() {
  return (
    <div className="absolute left-0 top-0 z-20 flex h-screen w-screen items-center justify-center">
      <Loading />
    </div>
  );
}
