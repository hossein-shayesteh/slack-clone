import SidebarButton from "@/src/app/workspace/[workspaceId]/_components/sidebar-button";
import WorkspaceSwitcher from "@/src/app/workspace/[workspaceId]/_components/workspace-switcher";
import { Home } from "lucide-react";

import UserButton from "@/src/features/auth/components/user-button";

const Sidebar = () => {
  return (
    <aside
      className={
        "flex h-full w-[70px] flex-col items-center gap-y-4 bg-[#481349] py-2"
      }
    >
      <WorkspaceSwitcher />
      <SidebarButton icon={Home} label={"Home"} isActive />
      <div
        className={"mt-auto flex flex-col items-center justify-center gap-y-1"}
      >
        <UserButton />
      </div>
      <div>A</div>
    </aside>
  );
};
export default Sidebar;
