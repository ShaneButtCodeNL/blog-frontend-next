import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiPath = `${process.env.API_HOST}${process.env.API_USER_BASE}/refresh`;
  const cookieStore = cookies();

  const refreshToken = await req.json();
  const token = refreshToken.refreshToken;
  if (!token || token === "") return NextResponse.json(null);

  if (!token) return NextResponse.json({ error: "Token has Expired." });
  const res = await fetch(apiPath, {
    method: "POST",
    headers: getRefreshTokenHeader(token),
    cache: "no-store",
  });
  if (!res.ok) return NextResponse.json({ error: "Token has Expired." });
  const header = res.headers.get("token");
  let expireDateString = res.headers.get("expires");
  if (!expireDateString)
    return NextResponse.json({ error: "Token has Expired." });
  let expireDateStringSplit = expireDateString.split(" ");
  expireDateStringSplit[4] = "GMT";
  expireDateString = expireDateStringSplit.join(" ");
  const expireDate = new Date(expireDateString);
  if (!header) return NextResponse.json({ error: "Token has Expired." });
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
  return response;
}
const getRefreshTokenHeader = (token: string) => ({
  token: token,
  "Content-Type": "application/json",
});
