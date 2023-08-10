import Authenticate from "@/components/Authenticate";
import Providers from "@/components/Provider";
import UserRoleEditor from "@/components/UserEditor";

export default function Page() {
  return (
    <div id="admin-control-panel">
      <UserRoleEditor />
    </div>
  );
}
