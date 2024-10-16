import React from "react";

import Sidebar from "@/src/app/workspace/[workspaceId]/_components/sidebar";
import Toolbar from "@/src/app/workspace/[workspaceId]/_components/toolbar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  return (
    <div className={"h-full"}>
      <Toolbar />
      <div className={"flex h-[calc(100vh-40px)]"}>
        <Sidebar />
        {children}
      </div>
    </div>
  );
};
export default WorkspaceLayout;
