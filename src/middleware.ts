import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {
  hasAnyAuthFunction,
  refreshFunctionMiddleware,
} from "./functions/serverFunctions";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  //return NextResponse.redirect(new URL("/home", request.url));
  // TODO add same functionality to admin ,extract refresh to function
  if (request.nextUrl.pathname.startsWith("/write-post")) {
    const response = NextResponse.next();
    let accessTokenCookie = request.cookies.get("accessToken");
    let accessToken;
    const refreshTokenCookie = request.cookies.get("jwt");
    console.log(refreshTokenCookie);
    if (!accessTokenCookie) {
      if (!refreshTokenCookie || refreshTokenCookie.value === "")
        return new NextResponse(
          JSON.stringify({ success: false, message: "Login again" }),
          { status: 401, headers: { "content-type": "application/json" } }
        );
      const refreshedToken = await refreshFunctionMiddleware(
        refreshTokenCookie.value
      );
      accessToken = refreshedToken.access.token;
      const refreshToken = refreshedToken.refresh.token;
      response.cookies.set("jwt", refreshToken!, {
        httpOnly: true,
        secure: true,
        expires: new Date(refreshedToken.refresh.expires),
        sameSite: "strict",
        path: "/",
      });
      response.cookies.set("accessToken", refreshedToken.access.token, {
        httpOnly: true,
        secure: true,
        expires: new Date(refreshedToken.access.expires),
        sameSite: "strict",
        path: "/",
      });
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
    return response;
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
