import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiPath = `${process.env.API_HOST}${process.env.API_USER_BASE}/login-with-token`;
  const refreshToken = await request.json();
  if (!refreshToken) return NextResponse.json({ error: "token invalid" });
  const res = await fetch(apiPath, {
    method: "POST",
    body: JSON.stringify(refreshToken),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    return NextResponse.json({ error: "token invalid" });
  }
  const header = res.headers.get("token");
  let expireDateString = res.headers.get("expires");
  if (!expireDateString)
    return NextResponse.json({ error: "Token has Expired." });
  let expireDateStringSplit = expireDateString.split(" ");
  expireDateStringSplit[4] = "GMT";
  expireDateString = expireDateStringSplit.join(" ");
  const expireDate = new Date(expireDateString);
  if (!header) return NextResponse.json({ error: "Token has Expired." });
  const cookieStore = cookies();
  cookieStore.set("jwt", header, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "strict",
    expires: expireDate,
  });
  const data = await res.json();
  const expireDateStringAccess = data.token.expires;
  const expireDateAccess = Date.parse(
    expireDateStringAccess.replace("NDT", "GMT")
  );
  data.token.expires = expireDateAccess;
  const response = NextResponse.json(data);
  response.cookies.set("jwt", header, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "strict",
    expires: expireDate,
  });
  return response;
}
