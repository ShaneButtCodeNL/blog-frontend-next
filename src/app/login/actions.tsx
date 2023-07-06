"use server";
import { login } from "@functions/apiController";

export async function loginFunction(username: string, password: string) {
  const res = await login(username, password);
  if (!res) {
    console.log("fail");
    return;
  }
  console.log("pass");
  return res;
}
