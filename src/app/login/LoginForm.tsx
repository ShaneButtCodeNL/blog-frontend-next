"use client";

import { loginFunctionServer } from "../../functions/serverFunctions";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { getDateInXHours, setLoginDetails } from "@/functions/helpers";

export default function LoginForm(params: any) {
  const [hidden, setHidden] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function loginSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await loginFunctionServer(username, password);
    if (!res) {
      router.push("/login/failure");
      return;
    }

    setLoginDetails(res.token.token!, res.details);
    router.push("/");
  }

  return (
    <div id="form-wrapper">
      <form onSubmit={(e) => loginSubmit(e)} id="login-form">
        <label
          htmlFor="username"
          id="username-label"
          className="form-label login-label"
        >
          Username
        </label>
        <input
          type="text"
          name="username"
          defaultValue={""}
          onChange={(e) => setUsername(e.target.value)}
          id="username-input"
          className="form-input"
          placeholder="Username"
        />
        <label
          htmlFor="password"
          id="password-label"
          className="form-label login-label"
        >
          Password
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
            placeholder="Password"
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
            placeholder="Password"
            required
          />
          <div
            id="form-input-container-eye"
            onClick={() => setHidden((v) => !v)}
          >
            {hidden ? (
              <FontAwesomeIcon icon={faEyeSlash} />
            ) : (
              <FontAwesomeIcon icon={faEye} />
            )}
          </div>
        </div>
        <button
          type="submit"
          id="login-confirm"
          className="form-button login-button"
        >
          Submit
        </button>
        <button
          type="button"
          id="login-cancel"
          className="form-button login-button"
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
