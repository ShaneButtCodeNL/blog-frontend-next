"use client";

import {
  getAllUsernamesFunction,
  getUserDetailsFromUsernameFunction,
} from "@/functions/serverFunctions";
import { UserDetails } from "@/models/userReturn";
import { ChangeEvent, useEffect, useState } from "react";

export default function UserRoleEditor() {
  const [userList, setUserList] = useState<string[]>([]);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [action, setAction] = useState(0);
  const [role, setRole] = useState<string>("");
  useEffect(() => {
    if (!window) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    getAllUsernamesFunction(token).then((res) => {
      setUserList(["", ...res]);
    });
  }, []);

  function submitFunction(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
  }
  return (
    <>
      <form id="user-role-editor-form" onSubmit={submitFunction}>
        <label>Username:</label>
        <select
          id="user-role-editor-user-select"
          onChange={(e) => {
            console.log("USERNAME:", e.target.value);
            if (e.target.value === "") setUser(null);
            else {
              getUserDetailsFromUsernameFunction(e.target.value).then((res) =>
                setUser(res)
              );
            }
          }}
        >
          {userList.map((v, i) => (
            <option value={v} key={`${v}-option-key-${i}`}>
              {v}
            </option>
          ))}
        </select>
        <label>Current Roles</label>
        <div id="user-current-roles-list">
          {user ? user.roles.join(" , ") : "Select a User"}
        </div>
        <label>Action</label>
        <select
          id="user-role-editor-actions"
          value={action}
          onChange={(e) => setAction(parseInt(e.target.value))}
        >
          <option value={0}>Add Role</option>
          <option value={1}>Remove Role</option>
        </select>
        <label>Role:</label>
        <select
          id="user-role-editor-role-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select a Role</option>
          <option value="ROLE_ADMIN">Admin</option>
          <option value="ROLE_WRITER">Writer</option>
        </select>
        <button
          type="submit"
          disabled={
            user === null ||
            role === "" ||
            (action === 0 && user.roles.includes(role)) ||
            (action === 1 && !user.roles.includes(role))
          }
        >
          Confirm
        </button>
      </form>
    </>
  );
}
