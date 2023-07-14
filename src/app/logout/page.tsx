"use client";

import { setLogoutDetails } from "@/functions/helpers";

export default function Page() {
  setLogoutDetails();
  return <div>LOGGED OUT.</div>;
}
