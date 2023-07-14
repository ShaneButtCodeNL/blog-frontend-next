import { isTokenValid } from "@/functions/apiController";

export default async function validateTokenFunction(token: string) {
  const res = await isTokenValid(token);
  return res === true;
}
