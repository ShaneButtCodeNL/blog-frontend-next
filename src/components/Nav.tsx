"use client";
import { useRouter } from "next/navigation";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import Link from "next/link";

import {
  faHouse,
  faPenNib,
  faUser,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserDetails } from "@/models/userReturn";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const hasRole = (userDetails: UserDetails, ...args: string[]) => {
  for (const arg of args) {
    if (userDetails.roles.indexOf(arg) > -1) return true;
  }
  return false;
};

export default function Nav(props: any) {
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector((state) => state.login.loggedIn);
  const userDetails: UserDetails | null = useAppSelector(
    (state) => state.login.userDetails
  );
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
      {userDetails &&
      hasRole(userDetails, "ROLE_WRITER", "ROLE_ADMIN", "ROLE_OWNER") ? (
        <Link href="/write-post">
          <button>
            <FontAwesomeIcon icon={faPenNib} />
            {" New Post"}
          </button>
        </Link>
      ) : (
        <></>
      )}
      {userDetails && loggedIn ? (
        <Link href={`/user/${userDetails?.username}`}>
          <FontAwesomeIcon icon={faUser} />
        </Link>
      ) : (
        <></>
      )}
      {loggedIn &&
      userDetails &&
      hasRole(userDetails, "ROLE_ADMIN", "ROLE_OWNER") ? (
        <Link href="/admin">
          <FontAwesomeIcon icon={faToolbox} />
          {" Admin"}
        </Link>
      ) : (
        <></>
      )}
    </nav>
  );
}
