import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("REFRESH");
  const cookieStore = cookies();
  const apiPath = `${process.env.API_HOST}${process.env.API_USER_BASE}/refresh`;
  if (!cookieStore.get("jwt")) return NextResponse.json(null);

  const token = cookieStore.get("jwt");
  console.log("TOKEN", token);
  if (!token) return NextResponse.json({ error: "Token has Expired." });
  const res = await fetch(apiPath, {
    method: "POST",
    headers: getRefreshTokenHeader(token.value),
    cache: "no-store",
  });
  if (!res.ok) return NextResponse.json({ error: "Token has Expired." });
  const header = res.headers.get("token");
  const expireDateString = res.headers.get("expires");
  if (!expireDateString)
    return NextResponse.json({ error: "Token has Expired." });

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
  return NextResponse.json(data);
}
const getRefreshTokenHeader = (token: string) => ({
  token: token,
  "Content-Type": "application/json",
});
