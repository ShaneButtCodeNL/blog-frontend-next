"use server";
import { isTokenValid, revalidateToken } from "./apiController";

export async function validateTokenFunction(token: string) {
  "use server";
  const valid = await isTokenValid(token);
  return valid;
}

export async function revalidateTokenFunction(token: string) {
  "use server";
  const newToken = await revalidateToken(token);
  return newToken;
}
