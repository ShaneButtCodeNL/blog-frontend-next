"use client";

import { store } from "@/store";
import { UserDetails } from "@/models/userReturn";
import { setLoggedIn, setUserDetails } from "@/store/login";
import { useRef } from "react";

export default function PreloadLogin() {
  "use client";
  const loggedIn = useRef(false);
  if (!loggedIn.current) {
    loggedIn.current = true;
    if (localStorage.getItem("token")) {
      if (localStorage.getItem("userDetails")) {
        store.dispatch(setLoggedIn(true));
        store.dispatch(
          setUserDetails(
            JSON.parse(
              localStorage.getItem("userDetails") as string
            ) as UserDetails
          )
        );
      }
    }
  }
  return null;
}
