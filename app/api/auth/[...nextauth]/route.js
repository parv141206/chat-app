import { validateUser } from "@/app/firebase/functions/fetchUsers";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = {
          name: credentials.username,
          email: credentials.email,
          password: credentials.password,
        };
        const res = await validateUser(user.email, user.password);
        console.log("Res from firebase:", res);
        // Check if res is an array and has at least one element
        if (Array.isArray(res) && res.length > 0) {
          console.log("OK");
          return Promise.resolve(user);
        }
        // Handle cases where res is not an array or is an empty array
        return Promise.resolve(null);
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // or 'database'
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: "192.168.31.183",
        secure: false, // Use secure cookies in production
      },
    },
  },
  logger: {
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  },
};
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
