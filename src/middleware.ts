import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  hasAnyAuthFunction,
  refreshFunctionServer,
} from "./functions/serverFunctions";
import { cookies } from "next/headers";
import { store } from "./store";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  //return NextResponse.redirect(new URL("/home", request.url));

  if (request.nextUrl.pathname.startsWith("/write-post")) {
    let accessTokenCookie = request.cookies.get("accessToken");
    let accessToken;
    if (!accessTokenCookie) {
      console.log("HERE");
      const refreshedToken = await refreshFunctionServer();
      accessToken = refreshedToken.token.token;
    } else {
      accessToken = accessTokenCookie.value;
    }
    console.log("ACCESS:", accessToken);

    const hasAuth = await hasAnyAuthFunction(accessToken, [
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
    let accessTokenCookie = request.cookies.get("accessToken");
    if (!accessTokenCookie) {
      return null;
    }
    let accessToken = accessTokenCookie.value;
    const hasAuth = await hasAnyAuthFunction(accessToken, ["ROLE_ADMIN"]);
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
