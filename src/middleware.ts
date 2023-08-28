import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {
  hasAnyAuthFunction,
  refreshFunctionMiddleware,
} from "./functions/serverFunctions";

async function processRefresh(req: NextRequest, res: NextResponse) {
  const accessTokenCookie = req.cookies.get("accessToken");
  const refreshTokenCookie = req.cookies.get("jwt");
  if (!refreshTokenCookie) {
    return null;
  }

  if (accessTokenCookie) {
    return {
      accessToken: accessTokenCookie.value,
      refreshToken: refreshTokenCookie?.value,
    };
  }

  const refreshedToken = await refreshFunctionMiddleware(
    refreshTokenCookie.value
  );
  const accessToken = refreshedToken.access.token;
  const refreshToken = refreshedToken.refresh.token;

  res.cookies.set("jwt", refreshToken!, {
    httpOnly: true,
    secure: true,
    expires: new Date(refreshedToken.refresh.expires),
    sameSite: "strict",
    path: "/",
  });
  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    expires: new Date(refreshedToken.access.expires),
    sameSite: "strict",
    path: "/",
  });

  return { accessToken, refreshToken };
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  //return NextResponse.redirect(new URL("/home", request.url));
  //Checks auth for write a new post page
  if (request.nextUrl.pathname.startsWith("/write-post")) {
    const response = NextResponse.next();
    const processRefreshedTokens = await processRefresh(request, response);
    if (!processRefreshedTokens)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Not Authourized to view page.",
        }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    const { accessToken } = processRefreshedTokens;
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
  // Checks auth for admin actions page
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const response = NextResponse.next();
    const processRefreshedTokens = await processRefresh(request, response);
    if (!processRefreshedTokens)
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Not Authourized to view page.",
        }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    const { accessToken } = processRefreshedTokens;
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
    return response;
  }
}
