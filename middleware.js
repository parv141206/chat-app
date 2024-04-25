import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = await getToken({ req: request });
  console.log("middleware:::", token);
  if (!token) {
    if (request.nextUrl.pathname === "/login") {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/about/:path*", "/chat/:path*"],
};
