"use client";
import { store } from "@/store";
import { UserDetails } from "@/models/userReturn";
import { setLoggedIn, setUserDetails } from "@/store/login";
import { useEffect, useRef } from "react";
import {
  revalidateTokenFunction,
  validateTokenFunction,
} from "@/functions/serverFunctions";

//TODO update token with a new valid token
export default function PreloadLogin() {
  "use client";
  const loggedIn = useRef(false);
  useEffect(() => {
    if (!loggedIn.current) {
      loggedIn.current = true;
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token") as string;
        if (localStorage.getItem("userDetails")) {
          validateTokenFunction(token).then((v) => {
            if (v) {
              console.log(token);
              revalidateTokenFunction(token).then((t) =>
                localStorage.setItem("token", t)
              );
              store.dispatch(setLoggedIn(true));
              store.dispatch(
                setUserDetails(
                  JSON.parse(
                    localStorage.getItem("userDetails") as string
                  ) as UserDetails
                )
              );
            }
          });
        }
      }
    }
  }, []);

  return null;
}
