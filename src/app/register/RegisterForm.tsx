"use client";
import { useRouter } from "next/navigation";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch, store } from "@/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { setLoggedIn, setLogin, setUserDetails } from "@/store/login";
import React, { FormEvent, useRef, useState } from "react";
import {
  checkUsernameIsAvailableFunction,
  loginFunctionServer,
  registerFunction,
  setTokenInCookie,
} from "@/functions/serverFunctions";
import { setLoginDetails } from "@/functions/helpers";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

var timeoutFunction: ReturnType<typeof setTimeout>;

const debounceAsync = (fn: Function, username: string) => {
  clearTimeout(timeoutFunction);

  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutFunction);
    if (username === "") {
      fn(false);
      return;
    }
    timeoutFunction = setTimeout(async () => {
      const res = await checkUsernameIsAvailableFunction(username);
      fn(res);
    }, 1500);
  };
};
//TODO update
export default function RegisterForm(props: any) {
  const [hidden, setHidden] = useState(true);
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [passwordMain, setPasswordMain] = useState("");
  const [
    passwordMatchesPatternLettersAndNumbers,
    setPasswordMatchesPatternLettersAndNumbers,
  ] = useState(false);
  const [passwordMatchesPatternNumber, setPasswordMatchesPatternNumber] =
    useState(false);
  const [
    passwordMatchesPatternLowerCaseLetters,
    setPasswordMatchesPatternLowerCaseLetters,
  ] = useState(false);
  const [
    passwordMatchesPatternUpperCaseLetters,
    setPasswordMatchesPatternUpperCaseLetters,
  ] = useState(false);
  const [
    passwordMatchesPatternIsEightCharactersLong,
    setPasswordMatchesPatternIsEightCharactersLong,
  ] = useState(false);
  const [
    passwordMatchesPatternNoWhiteSpace,
    setPasswordMatchesPatternNoWhiteSpace,
  ] = useState(false);

  const setPasswordMatchesPatternHook = (s: string) => {
    setPasswordMatchesPatternIsEightCharactersLong(
      regExpIsEightCharactersLong.test(s)
    );
    setPasswordMatchesPatternLettersAndNumbers(
      regExpContainsLettersAndNumbers.test(s)
    );
    setPasswordMatchesPatternLowerCaseLetters(
      regExpContainsLowerCaseLetters.test(s)
    );
    setPasswordMatchesPatternUpperCaseLetters(
      regExpContainsUpperCaseLetters.test(s)
    );
    setPasswordMatchesPatternNoWhiteSpace(!regExpContainsWhiteSpace.test(s));
    setPasswordMatchesPatternNumber(regExpContainsANumber.test(s));
  };
  const getPasswordMatchesPatternHook = () => {
    return (
      passwordMatchesPatternNoWhiteSpace &&
      passwordMatchesPatternIsEightCharactersLong &&
      passwordMatchesPatternLettersAndNumbers &&
      passwordMatchesPatternLowerCaseLetters &&
      passwordMatchesPatternNumber &&
      passwordMatchesPatternUpperCaseLetters
    );
  };

  const [passwordSecond, setPasswordSecond] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const setUsernameAvailableHook = (b: boolean) => {
    setUsernameAvailable(b);
    setCheckingUsername(false);
  };

  const [matchingPasswords, setMatchingPasswords] = useState(true);
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector((state) => state.login.loggedIn);
  const router = useRouter();

  const regExpContainsLettersAndNumbers = new RegExp(
    "(?=.*[0-9])(?=.*[a-z,A-Z])"
  );
  const regExpContainsLowerCaseLetters = new RegExp("(?=.*[a-z])");
  const regExpContainsUpperCaseLetters = new RegExp("(?=.*[A-Z])");
  const regExpContainsANumber = new RegExp("(?=.*[0-9])");
  const regExpIsEightCharactersLong = new RegExp("(.{8,})");
  const regExpContainsWhiteSpace = new RegExp("(?=.*\\s.*)");

  if (loggedIn) router.push("/");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !username ||
      username === "" ||
      !passwordMain ||
      passwordMain === "" ||
      !matchingPasswords ||
      !getPasswordMatchesPatternHook() ||
      !usernameAvailable
    )
      return;

    const res = await registerFunction(username, passwordMain);
    if (!res) {
      router.push("/register/fail");
      return;
    }
    //TODO update
    const loginRes = await loginFunctionServer(username, passwordMain);
    if (!loginRes || loginRes.token.error) {
      router.push("/register/fail");
      return;
    }
    setLoginDetails(loginRes.token.token!, loginRes.details);
    router.push("/register/success");
  };

  const useDebouncedFunction = (username: string) => {
    return debounceAsync(setUsernameAvailableHook, username);
  };

  return (
    <form id="register-form" onSubmit={onSubmit} autoComplete="off">
      <label htmlFor="username">Username : </label>
      <div className={`form-password-container `}>
        <input
          type="text"
          name="username"
          id="register-form-username-input"
          className="form-input"
          autoComplete="off"
          onChange={(e) => {
            setUsername(e.target.value);
            setValidUsername(!regExpContainsWhiteSpace.test(e.target.value));
            setCheckingUsername(true);
            useDebouncedFunction(e.target.value)();
          }}
        />
        <div
          className={`${
            validUsername || username === "" ? "hide" : "show"
          }-password-error-box password-error-box`}
        >
          <div
            id="password-help-uppercase-letters"
            className={`password-help-container ${
              validUsername ? "text-accept" : "text-reject"
            }`}
          >
            {validUsername ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faXmark} />
            )}
            Username Must Have No Whitespaces
          </div>
        </div>
      </div>

      <div
        id="register-form-username-available"
        className={`display-username-availability display-username${
          usernameAvailable ? "" : "-not"
        }-availabile ${
          checkingUsername ? "checking-display-username-availability" : ""
        }`}
        style={username === "" ? { display: "none" } : {}}
      >
        {checkingUsername ? (
          <>Checking Availability Of Username" {username} "</>
        ) : (
          <>
            Username " {username} "{" is "}
            {usernameAvailable ? (
              <>
                <FontAwesomeIcon icon={faCheck} />{" "}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faXmark} />
                {" Not "}
              </>
            )}{" "}
            Available
          </>
        )}
      </div>

      <label htmlFor="password-main">Password : </label>
      <div className={`form-password-container `}>
        <input
          required
          autoComplete="off"
          id="register-form-password-main-hidden-input"
          className={`form-input form-input-password ${
            getPasswordMatchesPatternHook() || passwordMain === ""
              ? ""
              : " boxshadow-alert"
          }`}
          value={passwordMain}
          onChange={(e) => {
            setMatchingPasswords(e.target.value === passwordSecond);
            setPasswordMatchesPatternHook(e.target.value);

            setPasswordMain(e.target.value);
          }}
          name="password-main"
          type="password"
          style={hidden ? {} : { display: "none" }}
        />
        <input
          required
          autoComplete="off"
          id="register-form-password-main-not-hidden-input"
          className={`form-input form-input-password ${
            getPasswordMatchesPatternHook() || passwordMain === ""
              ? ""
              : " boxshadow-alert"
          }`}
          value={passwordMain}
          onChange={(e) => {
            setMatchingPasswords(e.target.value === passwordSecond);
            setPasswordMatchesPatternHook(e.target.value);
            setPasswordMain(e.target.value);
          }}
          name="password-main"
          type="text"
          style={hidden ? { display: "none" } : {}}
        />
        <div
          className={`${
            getPasswordMatchesPatternHook() || passwordMain === ""
              ? "hide"
              : "show"
          }-password-error-box password-error-box`}
        >
          <div
            id="password-help-white-space"
            className={`password-help-container ${
              passwordMatchesPatternNoWhiteSpace ? "text-accept" : "text-reject"
            }`}
          >
            {passwordMatchesPatternNoWhiteSpace ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faXmark} />
            )}
            Password Must Have No White Spaces
          </div>
          <div
            id="password-help-uppercase-letters"
            className={`password-help-container ${
              passwordMatchesPatternUpperCaseLetters
                ? "text-accept"
                : "text-reject"
            }`}
          >
            {passwordMatchesPatternUpperCaseLetters ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faXmark} />
            )}
            Password Must Have Uppercase Letters
          </div>
          <div
            id="password-help-eight-char-length"
            className={`password-help-container ${
              passwordMatchesPatternIsEightCharactersLong
                ? "text-accept"
                : "text-reject"
            }`}
          >
            {passwordMatchesPatternIsEightCharactersLong ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faXmark} />
            )}
            Password Must Have At least 8 Characters
          </div>
          <div
            id="password-help-lowercase-letters"
            className={`password-help-container ${
              passwordMatchesPatternLowerCaseLetters
                ? "text-accept"
                : "text-reject"
            }`}
          >
            {passwordMatchesPatternLowerCaseLetters ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faXmark} />
            )}
            Password Must Have Lowercase Letters
          </div>
          <div
            id="password-help-number-char"
            className={`password-help-container ${
              passwordMatchesPatternNumber ? "text-accept" : "text-reject"
            }`}
          >
            {passwordMatchesPatternNumber ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faXmark} />
            )}
            Password Must Have At Least One Number
          </div>
          <div
            id="password-help-number-and-letters"
            className={`password-help-container ${
              passwordMatchesPatternLettersAndNumbers
                ? "text-accept"
                : "text-reject"
            }`}
          >
            {passwordMatchesPatternLettersAndNumbers ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faXmark} />
            )}
            Password Must Have Letters And Numbers
          </div>
        </div>
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
          autoComplete="off"
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
          style={hidden ? {} : { display: "none" }}
        />
        <input
          required
          autoComplete="off"
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
          style={hidden ? { display: "none" } : {}}
        />
        <div
          className={`${
            matchingPasswords || passwordSecond === "" ? "hide" : "show"
          }-password-error-box password-error-box`}
        >
          <div
            id="password-help-matches-second"
            className={`password-help-container ${
              matchingPasswords ? "text-accept" : "text-reject"
            }`}
          >
            {matchingPasswords ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faXmark} />
            )}
            Confirm Password Must be the same as Password
          </div>
        </div>
        <div id="form-input-container-eye" onClick={() => setHidden((v) => !v)}>
          {hidden ? (
            <FontAwesomeIcon icon={faEyeSlash} />
          ) : (
            <FontAwesomeIcon icon={faEye} />
          )}
        </div>
      </div>
      <button
        type="submit"
        id="register-form-confirm"
        disabled={!getPasswordMatchesPatternHook() || passwordMain === ""}
      >
        Confirm
      </button>
      <button type="button" id="register-form-cancel" onClick={router.back}>
        Cancel
      </button>
    </form>
  );
}
