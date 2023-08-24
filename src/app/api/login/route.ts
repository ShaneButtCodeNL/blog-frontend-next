import { cookies } from "next/headers";
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
  const expireDateString = res.headers
    .get("tokenExpires")
    ?.replace("NDT", "GMT");
  if (!expireDateString) return null;
  const expireDate = Date.parse(expireDateString);
  if (!header) return null;
  // const cookieStore = cookies();

  // cookieStore.set("jwt", header, {
  //   httpOnly: true,
  //   path: "/",
  //   secure: true,
  //   sameSite: "strict",
  //   expires: expireDate,
  // });
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
