"use client";
import { loginFunction } from "./actions";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { store } from "@/store";
import { setLoggedIn, setUserDetails } from "@/store/login";

export default function Page() {
  const [hidden, setHidden] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function loginSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await loginFunction(username, password);
    console.log("res", res);
    if (!res) {
      router.push("/login/failure");
      return;
    }
    localStorage.setItem("token", res?.token as string);
    localStorage.setItem("userDetails", JSON.stringify(res?.details));
    store.dispatch(setLoggedIn(true));
    store.dispatch(setUserDetails(res.details));
    router.push("/login/success");
  }

  return (
    <form onSubmit={(e) => loginSubmit(e)} id="login-form">
      <label htmlFor="username" id="username-label" className="form-label">
        Username :{" "}
      </label>
      <input
        type="text"
        name="username"
        defaultValue={""}
        onChange={(e) => setUsername(e.target.value)}
        id="username-input"
        className="form-input"
      />
      <label htmlFor="password" id="password-label" className="form-label">
        Password :{" "}
      </label>
      <div id="form-input-container">
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password-input"
          className="form-input"
          style={!hidden ? { display: "none" } : {}}
          required
        />
        <input
          type="text"
          name="password"
          value={password}
          id="password-input"
          className="form-input"
          style={hidden ? { display: "none" } : {}}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div id="form-input-container-eye" onClick={() => setHidden((v) => !v)}>
          {hidden ? (
            <FontAwesomeIcon icon={faEyeSlash} />
          ) : (
            <FontAwesomeIcon icon={faEye} />
          )}
        </div>
      </div>
      <button type="submit" id="login-confirm" className="form-button">
        Submit
      </button>
      <button
        type="button"
        id="login-cancel"
        className="form-button"
        onClick={() => router.back()}
      >
        Cancel
      </button>
    </form>
  );
}
