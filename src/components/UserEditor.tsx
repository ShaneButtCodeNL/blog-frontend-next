"use client";

import {
  addRoleToUserFunction,
  banUserFunction,
  deleteUserFunction,
  disableUserFunction,
  enableUserFunction,
  getAllUsernamesFunction,
  getUserDetailsFromUsernameFunction,
  removeRoleToUserFunction,
  unbanUserFunction,
} from "@/functions/serverFunctions";
import { UserDetails } from "@/models/userReturn";
import { store } from "@/store";
import { ChangeEvent, useEffect, useState } from "react";

const addRoleAction = 0;
const removeRoleAction = 1;
const banUserAction = 2;
const unbanUserAction = 3;
const disableUserAction = 4;
const enableUserAction = 5;
const deleteUserAction = 6;

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
      case deleteUserAction: {
        return "Removing user is an unreversable action. This user will be removed from the database permanent action.";
      }
      case banUserAction: {
        return "This will ban user. User data will be kept in the database but user will no longer be able to log in or preform actions with this account or it's tokens.";
      }
      case disableUserAction: {
        return "This will disable account. User data will be kept in the database, user will no longer be able to log in or preform actions with this account and data will be hidden.";
      }
      default: {
        return "";
      }
    }
  }
  useEffect(() => {
    if (!window) return;
    const token = store.getState().login.accessToken;
    if (!token) return;
    getAllUsernamesFunction(token).then((res) => {
      setUserList(["", ...res]);
    });
  }, []);

  function submitFunction(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!window) return;
    const token = store.getState().login.accessToken;
    if (!token) return;
    if (!user) return;
    if (action === removeRoleAction) {
      if (role === "") return;
      removeRoleToUserFunction(token, role, user.username as string).then(
        (res) => {
          setUser(res);
        }
      );
    } else if (action === addRoleAction) {
      if (role === "") return;
      addRoleToUserFunction(token, role, user.username as string).then(
        (res) => {
          setUser(res);
        }
      );
    } else if (action === banUserAction) {
      banUserFunction(token, user.username as string).then((res) => {
        setUser(res);
        setAction(unbanUserAction);
      });
    } else if (action === unbanUserAction) {
      unbanUserFunction(token, user.username as string).then((res) => {
        setUser(res);
        setAction(banUserAction);
      });
    } else if (action === disableUserAction) {
      disableUserFunction(token, user.username as string).then((res) => {
        setUser(res);
        setAction(enableUserAction);
      });
    } else if (action === enableUserAction) {
      enableUserFunction(token, user.username as string).then((res) => {
        setUser(res);
        setAction(disableUserAction);
      });
    } else if (action === deleteUserAction) {
      deleteUserFunction(token, user.username as string).then((res) => {
        setUser(null);
        setAction(0);
      });
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
          Username
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
        <label id="ban-label">Ban Status</label>
        <div
          id="ban-status"
          className={user ? (user.banned ? "text-reject" : "text-accept") : ""}
        >
          {user ? (user.banned ? "Banned" : "Not Banned") : "Select A User"}
        </div>
        <label id="disabled-label">Disabled Status</label>
        <div
          id="disabled-status"
          className={
            user ? (user.disabled ? "text-reject" : "text-accept") : ""
          }
        >
          {user ? (user.disabled ? "Disabled" : "Enabled") : "Select A User"}
        </div>
        <label id="action-label" htmlFor="user-role-action-select">
          Action
        </label>
        <select
          name="user-role-action-select"
          id="user-role-editor-actions"
          className="form-select"
          value={action}
          onChange={(e) => setAction(parseInt(e.target.value))}
        >
          <option value={addRoleAction}>Add Role</option>
          <option value={removeRoleAction}>Remove Role</option>
          <option
            value={user?.banned ? unbanUserAction : banUserAction}
            style={{}}
          >{`${user?.banned ? "Unb" : "B"}an User`}</option>
          <option
            value={user?.disabled ? enableUserAction : disableUserAction}
          >{`${user?.disabled ? "En" : "Dis"}able User`}</option>
          <option value={deleteUserAction}>Remove User</option>
        </select>
        <label
          id="role-label"
          htmlFor="role-select"
          style={isRoleAction() ? {} : { display: "none" }}
        >
          Role
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
