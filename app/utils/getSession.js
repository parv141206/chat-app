"use server";
import { getServerSession } from "next-auth";

export const getSession = async () => {
  const session = await getServerSession();
  return JSON.stringify(session);
};
