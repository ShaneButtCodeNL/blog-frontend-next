import { getUserDetailsFromUsername } from "@/functions/apiController";
import { UserDetails } from "@/models/userReturn";
import { redirect } from "next/navigation";

async function getUserDetails(username: string) {
  try {
    const userDetails = await getUserDetailsFromUsername(username);
    return userDetails;
  } catch (e) {
    redirect("/");
  }
}

const getDateString = (input: Date): string => {
  const date = new Date(input);
  return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} / ${
    date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
  } / ${date.getFullYear()}`;
};

const getHighestRole = (userDetails: UserDetails) => {
  if (userDetails.roles.includes("ROLE_OWNER")) return "Owner";
  if (userDetails.roles.includes("ROLE_ADMIN")) return "Admin";
  if (userDetails.roles.includes("ROLE_WRITER")) return "Writer";
  if (userDetails.roles.includes("ROLE_USER")) return "User";
  return "No Role";
};

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const data = await getUserDetails(params.username);
  return (
    <div id="user-display-container">
      <div id="username">{data.username}</div>
      <div id="user-id">{data.userId}</div>
      <div id="user-creation-date">
        Member since: {getDateString(data.createdOn)}
      </div>
      <div id="user-role">Role : {getHighestRole(data)}</div>
    </div>
  );
}
