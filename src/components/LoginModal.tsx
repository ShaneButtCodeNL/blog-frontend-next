"use client";

import { closeLoginModal, setLoginDetails } from "@/functions/helpers";
import { loginFunction } from "@/functions/serverFunctions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

export default function LoginModal() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const dialogRef = useRef(null);
  const router = useRouter();

  function submitFormFunction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    loginFunction(username, password).then((res) => {
      if (!res) {
        setLoginError(true);
        return;
      }
      setLoginDetails(res.token as string, res.details);
      closeLoginModal();
      //router.refresh();
    });
  }

  return (
    <dialog id="login-modal" ref={dialogRef}>
      <form id="login-modal-form" onSubmit={submitFormFunction}>
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
          onChange={(e) => setUsername(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
        />
        <button type="submit" id="login-modal-confirm" className="form-button">
          Login
        </button>
        <button
          type="button"
          id="login-modal-cancel"
          className="form-button"
          onClick={closeLoginModal}
        >
          Cancel
        </button>
        <div id="login-modal-register">
          Not a member.
          <br /> Why not{" "}
          <Link href="/register">
            <button type="button" className="button" onClick={closeLoginModal}>
              Register
            </button>
          </Link>
          ?
        </div>
      </form>
    </dialog>
  );
}
