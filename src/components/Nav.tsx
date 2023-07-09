"use client";
import { useRouter } from "next/navigation";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import Link from "next/link";
import { setLoggedIn } from "@/store/login";

import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function Nav(props: any) {
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector((state) => state.login.loggedIn);
  const router = useRouter();
  return (
    <nav id="main-nav">
      <Link href={"/"}>
        <button type="button">
          <FontAwesomeIcon icon={faHouse} />
        </button>
      </Link>
      {loggedIn ? (
        <button
          type="button"
          onClick={() => {
            dispatch(setLoggedIn(false));
            localStorage.removeItem("token");
            localStorage.removeItem("userDetails");
            router.push("/logout");
          }}
        >
          Logout
        </button>
      ) : (
        <>
          <Link href={"/login"}>
            <button type="button">Login</button>
          </Link>
          <Link href={"/register"}>
            <button type="button">Register</button>
          </Link>
        </>
      )}
    </nav>
  );
}
