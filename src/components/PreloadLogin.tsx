"use client";
import { store } from "@/store";
import { UserDetails } from "@/models/userReturn";
import { setLoggedIn, setUserDetails } from "@/store/login";
import { MutableRefObject, use, useEffect, useRef, useState } from "react";
import { validateTokenFunction } from "@/functions/serverFunctions";
import { isTokenValid } from "@/functions/apiController";

const tokenMap = new Map<string, Promise<boolean>>();

function queryToken(token: string, promise: () => Promise<boolean>) {
  if (!tokenMap.has(token)) {
    tokenMap.set(token, promise());
  }
  return tokenMap.get(token);
}

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
