"use server";
import { register } from "@/functions/apiController";
export async function registerFunction(username: string, password: string) {
  const res = await register(username, password);
  if (!res) {
    console.log("fail");
    return;
  }
  console.log("pass");
  return res;
}
