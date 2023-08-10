"use client";
import { store } from "@/store";
import { useRouter } from "next/navigation";

export default function Authenticate({
  roles,
  required = false,
  children,
}: {
  roles?: string[];
  required?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  function unauthorizedAction() {
    router.push("/");
  }
  if (!roles || !store.getState().login.loggedIn) {
    unauthorizedAction();
    return <></>;
  }
  for (const role of roles!) {
    const hasRole = store.getState().login.userDetails?.roles.includes(role);
    if (required) {
      if (!hasRole) {
        unauthorizedAction();
        return <></>;
      }
    } else {
      if (hasRole) {
        return <>{children}</>;
      }
    }
  }
  if (!required) {
    unauthorizedAction();
    return <></>;
  }
  return <>{children}</>;
}
