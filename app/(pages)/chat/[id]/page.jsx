"use client";
import { fetchUsers } from "@/app/firebase/functions/fetchUsers";
import React, { useEffect } from "react";

export default function Page({ params }) {
  return <div>My Post: {params.id}</div>;
}
