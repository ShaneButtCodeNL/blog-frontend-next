"use client";
import { UserDetails } from "@/models/userReturn";
import { setLogin } from "@/store/login";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { store } from "@/store";
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
  useMemo(() => {
    if (!loggedIn.current) {
      loggedIn.current = true;
      if (accessToken && userDetails) {
        store.dispatch(setLogin({ accessToken, userDetails }));
      }
    }
  }, []);

  return children;
}
