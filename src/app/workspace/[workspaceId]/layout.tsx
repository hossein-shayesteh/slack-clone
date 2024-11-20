import React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/src/components/ui/resizable";

import Sidebar from "@/src/app/workspace/[workspaceId]/_components/sidebar";
import Toolbar from "@/src/app/workspace/[workspaceId]/_components/toolbar";
import WorkspaceSidebar from "@/src/app/workspace/[workspaceId]/_components/workspace-sidebar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  return (
    <div className={"h-full"}>
      <Toolbar />
      <div className={"flex h-[calc(100vh-40px)]"}>
        <Sidebar />
        <ResizablePanelGroup
          direction={"horizontal"}
          autoSaveId={"workspaceId-layout-sidebar"}
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className={"bg-[#5e2c5f]"}
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
export default WorkspaceLayout;
