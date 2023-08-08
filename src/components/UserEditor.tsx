"use client";

import {
  addRoleToUserFunction,
  getAllUsernamesFunction,
  getUserDetailsFromUsernameFunction,
  removeRoleToUserFunction,
} from "@/functions/serverFunctions";
import { UserDetails } from "@/models/userReturn";
import { ChangeEvent, useEffect, useState } from "react";

export default function UserRoleEditor() {
  const [userList, setUserList] = useState<string[]>([]);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [action, setAction] = useState(0);
  const [role, setRole] = useState<"" | "ADMIN" | "WRITER" | "MODERATOR">("");
  function isRoleAction() {
    return action === 0 || action === 1;
  }
  function getActionMessage() {
    switch (action) {
      case 3: {
        return "Removing user is an unreversable action. This user will be removed from the database permanent action.";
      }
      case 2: {
        return "This will ban user. User data will be kept in the database but user will no longer be able to log in or preform actions with this account or it's tokens.";
      }
      default: {
        return "";
      }
    }
  }
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
    if (!window) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    if (role === "" || role === "MODERATOR") return;
    if (!user) return;
    console.log("action:", action, "\nrole:", role, "\nuser:", user);
    //Remove Role
    if (action === 1) {
      removeRoleToUserFunction(token, role, user.username as string).then(
        (res) => {
          console.log(res);
          setUser(res);
        }
      );
    }
    //Add
    else if (action === 0) {
      addRoleToUserFunction(token, role, user.username as string).then(
        (res) => {
          console.log(res);

          setUser(res);
        }
      );
    }
    // Remove user
    else if (action === 3) {
    }
  }
  return (
    <fieldset
      className="admin-control-form-container"
      style={{ border: "solid 1px", padding: "1em 2em" }}
    >
      <legend style={{ padding: "0 1em" }}>User Role Editor</legend>
      <form
        id="user-role-editor-form"
        onSubmit={submitFunction}
        className="admin-control-form"
      >
        <label id="username-label" htmlFor="user-select">
          Username:
        </label>
        <select
          name="user-select"
          id="user-role-editor-user-select"
          className="form-select"
          onChange={(e) => {
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
        <label id="current-roles-label">Current Roles</label>
        <div id="user-current-roles-list">
          {user
            ? user.roles.map((v) => <p>{v.substring(5)}</p>)
            : "Select a User"}
        </div>
        <label id="action-label" htmlFor="user-role-action-select">
          Action :
        </label>
        <select
          name="user-role-action-select"
          id="user-role-editor-actions"
          className="form-select"
          value={action}
          onChange={(e) => setAction(parseInt(e.target.value))}
        >
          <option value={0}>Add Role</option>
          <option value={1}>Remove Role</option>
          <option value={2}>Ban User(Not Implemented)</option>
          <option value={3}>Remove User</option>
        </select>
        <label
          id="role-label"
          htmlFor="role-select"
          style={isRoleAction() ? {} : { display: "none" }}
        >
          Role:
        </label>
        <select
          name="role-select"
          id="user-role-editor-role-select"
          className="form-select"
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "" | "ADMIN" | "WRITER" | "MODERATOR")
          }
          style={isRoleAction() ? {} : { display: "none" }}
        >
          <option value="">Select a Role</option>
          <option value="ADMIN">Admin</option>
          <option value="WRITER">Writer</option>
        </select>
        <button
          id="user-role-editor-confirm"
          className="form-button"
          type="submit"
          disabled={
            user === null ||
            (role === "" && isRoleAction()) ||
            (action === 0 && user.roles.includes(role)) ||
            (action === 1 && !user.roles.includes(`ROLE_${role}`))
          }
        >
          Confirm
        </button>
        <div
          id="user-editor-message"
          className="text-reject"
          style={isRoleAction() ? {} : { opacity: 1 }}
        >
          {getActionMessage()}
        </div>
      </form>
    </fieldset>
  );
}
