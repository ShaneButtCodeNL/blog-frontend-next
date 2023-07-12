"use server";
import { register, isUsernameAvailable } from "@/functions/apiController";
export async function registerFunction(username: string, password: string) {
  const res = await register(username, password);
  if (!res) {
    return;
  }
  return res;
}
export async function checkUsernameIsAvailableFunction(username: string) {
  const res = await isUsernameAvailable(username);
  console.log("is ", username as string, " available: ", res);
  return res === true;
}
