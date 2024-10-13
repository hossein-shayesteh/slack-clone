import React from "react";

import Toolbar from "@/src/app/workspace/[workspaceId]/_components/toolbar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  return (
    <div className={"h-full"}>
      <Toolbar />
      {children}
    </div>
  );
};
export default WorkspaceLayout;
