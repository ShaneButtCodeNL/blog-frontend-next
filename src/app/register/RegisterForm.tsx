"use client";
import { useRouter } from "next/navigation";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { store } from "@/store";
import { setLoggedIn, setUserDetails } from "@/store/login";
import React, { FormEvent, useState } from "react";
import { register } from "@/functions/apiController";
import { registerFunction } from "./actions";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function RegisterForm(props: any) {
  const [hidden, setHidden] = useState(true);
  const [username, setUsername] = useState("");
  const [passwordMain, setPasswordMain] = useState("");
  const [passwordSecond, setPasswordSecond] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [matchingPasswords, setMatchingPasswords] = useState(true);
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector((state) => state.login.loggedIn);
  const router = useRouter();

  if (loggedIn) router.push("/");

  // Half a second

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("HERE 1");

    if (!passwordMain || passwordMain === "" || passwordMain !== passwordSecond)
      return;
    console.log("HERE 2");

    const res = await registerFunction(username, passwordMain);
    if (!res) {
      router.push("/register/fail");
      return;
    }
    console.log("HERE 3");

    localStorage.setItem("token", res.token as string);
    localStorage.setItem("userDetails", JSON.stringify(res.details));
    store.dispatch(setLoggedIn(true));
    store.dispatch(setUserDetails(res.details));
    console.log("HERE 4");

    router.push("/register/success");
  };

  return (
    <form id="register-form" onSubmit={onSubmit}>
      <label htmlFor="username">Username : </label>
      <input
        type="text"
        name="username"
        id="register-form-username-input"
        className="form-input"
        onChange={(e) => setUsername(e.target.value)}
      />
      {usernameAvailable ? (
        <div
          id="register-form-username-available"
          className="display-username-availability"
        >
          Available
        </div>
      ) : (
        <div
          id="register-form-username-unavailable"
          className="display-username-availability"
        >
          Not Available
        </div>
      )}
      <label htmlFor="password-main">Password : </label>
      <div className="form-password-container">
        <input
          required
          id="register-form-password-main-hidden-input"
          className="form-input form-input-password"
          value={passwordMain}
          onChange={(e) => {
            setMatchingPasswords(e.target.value === passwordSecond);
            setPasswordMain(e.target.value);
          }}
          name="password-main"
          type="password"
          style={hidden ? { display: "none" } : {}}
        />
        <input
          required
          id="register-form-password-main-not-hidden-input"
          className="form-input form-input-password"
          value={passwordMain}
          onChange={(e) => {
            setMatchingPasswords(e.target.value === passwordSecond);
            setPasswordMain(e.target.value);
          }}
          name="password-main"
          type="text"
          style={hidden ? {} : { display: "none" }}
        />
        <div id="form-input-container-eye" onClick={() => setHidden((v) => !v)}>
          {hidden ? (
            <FontAwesomeIcon icon={faEyeSlash} />
          ) : (
            <FontAwesomeIcon icon={faEye} />
          )}
        </div>
      </div>
      <label
        htmlFor={`password-second ${
          matchingPasswords ? "" : "boxshadow-alert"
        } `}
      >
        Confirm Password :{" "}
      </label>
      <div className={`form-password-container `}>
        <input
          required
          id="register-form-password-second-hidden-input"
          className={`form-input form-input-password ${
            matchingPasswords ? "" : "boxshadow-alert"
          }`}
          value={passwordSecond}
          onChange={(e) => {
            setMatchingPasswords(e.target.value === passwordMain);
            setPasswordSecond(e.target.value);
          }}
          name="password-second"
          type="password"
          style={hidden ? { display: "none" } : {}}
        />
        <input
          required
          id="register-form-password-second-not-hidden-input"
          className={`form-input form-input-password ${
            matchingPasswords ? "" : "boxshadow-alert"
          }`}
          value={passwordSecond}
          onChange={(e) => {
            setMatchingPasswords(e.target.value === passwordMain);
            setPasswordSecond(e.target.value);
          }}
          name="password-second"
          type="text"
          style={hidden ? {} : { display: "none" }}
        />
        <div id="form-input-container-eye" onClick={() => setHidden((v) => !v)}>
          {hidden ? (
            <FontAwesomeIcon icon={faEyeSlash} />
          ) : (
            <FontAwesomeIcon icon={faEye} />
          )}
        </div>
      </div>
      <button type="submit" id="register-form-confirm">
        Confirm
      </button>
      <button type="button" id="register-form-cancel" onClick={router.back}>
        Cancel
      </button>
    </form>
  );
}
