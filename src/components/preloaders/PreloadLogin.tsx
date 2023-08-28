"use client";
import { UserDetails } from "@/models/userReturn";
import { setLoggedIn, setLogin, setUserDetails } from "@/store/login";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  loginInitFunctionServer,
  revalidateTokenFunction,
  setTokenInCookie,
  validateTokenFunction,
} from "@/functions/serverFunctions";
import { store } from "@/store";
import SplashPage from "../SplashPage";
// TODO FIX
interface PreloadType {
  accessToken?: string;
  userDetails?: UserDetails;
  children: ReactNode;
}
export default function PreloadLogin({
  accessToken,
  userDetails,
  children,
}: PreloadType) {
  const loggedIn = useRef(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!loggedIn.current) {
      loggedIn.current = true;
      if (accessToken && userDetails) {
        store.dispatch(setLogin({ accessToken, userDetails }));
      }
      setLoaded(true);
    }
  }, []);

  return loaded ? children : <SplashPage />;
}
