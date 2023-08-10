import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasAnyAuthFunction } from "./functions/serverFunctions";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  //return NextResponse.redirect(new URL("/home", request.url));
  const cookies = request.cookies;
  if (request.nextUrl.pathname.startsWith("/write-post")) {
    const hasAuth = await hasAnyAuthFunction(cookies.get("token")?.value, [
      "ROLE_ADMIN",
      "ROLE_WRITER",
    ]);
    if (!hasAuth) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Not Authourized to view page.",
        }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }
  }
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const hasAuth = await hasAnyAuthFunction(cookies.get("token")?.value, [
      "ROLE_ADMIN",
    ]);
    if (!hasAuth) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Not Authourized to view page.",
        }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }
  }
}
