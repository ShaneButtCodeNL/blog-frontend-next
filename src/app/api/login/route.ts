import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiPath = `${process.env.API_HOST}${process.env.API_USER_BASE}/login`;
  const { username, password }: { username: string; password: string } =
    await request.json();

  const res = await fetch(apiPath, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (res.status >= 400) return null;
  if (!res) return null;
  const data = await res.json();
  if (!data) throw new Error("User not found");
  const header = res.headers.get("token");
  const expireDateStringRefresh = res.headers
    .get("tokenExpires")
    ?.replace("NDT", "GMT");
  if (!expireDateStringRefresh) return null;
  const expireDate = Date.parse(expireDateStringRefresh);
  if (!header) return null;
  const expireDateStringAccess = data.token.expires;
  const expireDateAccess = Date.parse(
    expireDateStringAccess.replace("NDT", "GMT")
  );
  data.token.expires = expireDateAccess;
  console.log("DATA", data);
  const response = NextResponse.json(data);
  response.cookies.set({
    name: "jwt",
    value: header,
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "strict",
    expires: expireDate,
  });
  return response;
}
