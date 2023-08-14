"use client";
import { store } from "@/store";
import { UserDetails } from "@/models/userReturn";
import { setLoggedIn, setUserDetails } from "@/store/login";
import { ReactNode, useMemo, useRef, useState } from "react";
import {
  revalidateTokenFunction,
  setTokenInCookie,
  validateTokenFunction,
} from "@/functions/serverFunctions";

export default function PreloadLogin({ children }: { children: ReactNode }) {
  const loggedIn = useRef(false);
  const [loaded, setLoaded] = useState(false);
  useMemo(() => {
    if (!loggedIn.current) {
      loggedIn.current = true;
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token") as string;
        if (localStorage.getItem("userDetails")) {
          validateTokenFunction(token).then((v) => {
            if (v) {
              revalidateTokenFunction(token).then((t) => {
                localStorage.setItem("token", t);
                setTokenInCookie(t);
              });
              store.dispatch(setLoggedIn(true));
              store.dispatch(
                setUserDetails(
                  JSON.parse(
                    localStorage.getItem("userDetails") as string
                  ) as UserDetails
                )
              );
            }
            setLoaded(true);
          });
        } else {
          setLoaded(true);
        }
      } else {
        setLoaded(true);
      }
    }
  }, []);

  return loaded ? children : <></>;
}
