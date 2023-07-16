"use client";

import { setLogoutDetails } from "@/functions/helpers";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => setLogoutDetails(), []);
  return <div>LOGGED OUT.</div>;
}
