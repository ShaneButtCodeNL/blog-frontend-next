"use client";
import { useRouter } from "next/navigation";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch, store } from "@/store";
import Link from "next/link";

import {
  faHouse,
  faPenNib,
  faUser,
  faToolbox,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserDetails } from "@/models/userReturn";
import {
  logoutServerFunction,
  refreshFunctionServer,
} from "@/functions/serverFunctions";
import { setLogout } from "@/store/login";

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
  function logutClick() {
    logoutServerFunction().then((_) => {
      dispatch(setLogout());
      router.push("/");
    });
  }
  const loggedIn = useAppSelector((state) => state.login.loggedIn);
  const userDetails: UserDetails | null = useAppSelector(
    (state) => state.login.userDetails
  );
  const router = useRouter();
  return (
    <nav id="main-nav">
      <button
        type="button"
        onClick={() => {
          refreshFunctionServer();
        }}
      >
        [TEST]
      </button>
      <Link href={"/"}>
        <button type="button" title="Home">
          <FontAwesomeIcon icon={faHouse} />
        </button>
      </Link>
      <Link href={"/blogs/1"}>
        <button type="button" title="Blogs">
          <FontAwesomeIcon icon={faBook} />
        </button>
      </Link>
      {loggedIn ? (
        <button type="button" onClick={logutClick}>
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
          <button type="button" title="Write A Post">
            <FontAwesomeIcon icon={faPenNib} />
          </button>
        </Link>
      ) : (
        <></>
      )}

      {loggedIn &&
      userDetails &&
      hasRole(userDetails, "ROLE_ADMIN", "ROLE_OWNER") ? (
        <Link href="/admin/controls">
          <button type="button" title="Admin Controls">
            <FontAwesomeIcon icon={faToolbox} />
            {" Admin"}
          </button>
        </Link>
      ) : (
        <></>
      )}
      {userDetails && loggedIn ? (
        <Link href={`/user/${userDetails?.username}`}>
          <button type="button" title="User Details">
            <FontAwesomeIcon icon={faUser} />{" "}
            {store.getState().login.userDetails?.username}
          </button>
        </Link>
      ) : (
        <></>
      )}
    </nav>
  );
}
