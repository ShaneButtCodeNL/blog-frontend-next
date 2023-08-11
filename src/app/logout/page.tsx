"use client";

import { setLogoutDetails } from "@/functions/helpers";
import { logoutServerFunction } from "@/functions/serverFunctions";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    setLogoutDetails();
    logoutServerFunction();
  }, []);
  return <div>LOGGED OUT.</div>;
}
