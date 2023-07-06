"use client";
import { loginFunction } from "./actions";
import { redirect, useRouter } from "next/navigation";
import React, { FormEvent, useRef } from "react";

export default async function Page() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const router = useRouter();

  async function loginSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("HERE", usernameRef);
    const username = usernameRef.current?.value as string;
    const password = passwordRef.current?.value as string;
    console.log(username, password);
    const res = await loginFunction(username, password);
    console.log("res", res);
    if (!res) {
      router.push("/login/failure");
      return;
    }
    localStorage.setItem("token", res?.token as string);
    localStorage.setItem("userDetails", JSON.stringify(res?.details));
    router.push("/login/success");
  }

  return (
    <>
      <h1>LOGIN PAGE</h1>
      <form onSubmit={async (e) => await loginSubmit(e)}>
        <label htmlFor="username">Username : </label>
        <input
          type="text"
          name="username"
          defaultValue={"test-user1-name"}
          ref={usernameRef}
        />
        <label htmlFor="password">Password : </label>
        <input
          type="text"
          name="password"
          defaultValue={"test-user1-pass"}
          ref={passwordRef}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
