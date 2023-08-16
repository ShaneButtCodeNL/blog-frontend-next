"use client";

import { closeLoginModal } from "@/functions/helpers";
import { loginFunction } from "@/functions/serverFunctions";
import { store } from "@/store";
import { setLoggedIn, setUserDetails } from "@/store/login";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

export default function LoginModal() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const dialogRef = useRef<null | HTMLDialogElement>(null);

  function submitFormFunction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    loginFunction(username, password).then((res) => {
      if (!res) {
        setLoginError(true);
        return;
      }
      store.dispatch(setUserDetails(res.details));
      store.dispatch(setLoggedIn(true));
      localStorage.setItem("token", res.token as string);
      localStorage.setItem("userDetails", JSON.stringify(res.details));
      closeModalFunction();
    });
  }

  function closeModalFunction() {
    closeLoginModal();
    setPassword("");
    setUsername("");
    setLoginError(false);
  }

  return (
    <dialog
      id="login-modal"
      className="modal"
      ref={dialogRef}
      onClick={(e) => {
        e.stopPropagation();
        closeModalFunction();
      }}
    >
      <form
        id="login-modal-form"
        className="modal-form"
        onSubmit={submitFormFunction}
        onClick={(e) => e.stopPropagation()}
      >
        <label
          htmlFor="login-modal-username"
          id="login-modal-username-label"
          className="form-label"
        >
          Username
        </label>
        <input
          type="text"
          placeholder="Username"
          name="login-modal-username"
          id="login-modal-username-input"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setLoginError(false);
          }}
          className="form-input"
        />
        <label
          htmlFor="login-modal-password"
          id="login-modal-password-label"
          className="form-label"
        >
          Password
        </label>
        <input
          id="login-modal-password-input-hidden"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
            setLoginError(false);
          }}
          className="form-input"
        />
        <button type="submit" id="login-modal-confirm" className="form-button">
          Login
        </button>
        <button
          type="button"
          id="login-modal-cancel"
          className="form-button"
          onClick={closeModalFunction}
        >
          Cancel
        </button>
        <div id="login-modal-register">
          Not a member.
          <br /> Why not{" "}
          <Link href="/register">
            <button
              type="button"
              className="button"
              onClick={closeModalFunction}
            >
              Register
            </button>
          </Link>
        </div>
        <div
          id="login-modal-error"
          style={loginError ? {} : { display: "none" }}
        >
          {" "}
          Something went wrong. Ensure you inputed valid credentials, if it
          still doesn't work please try again later.
        </div>
      </form>
    </dialog>
  );
}
