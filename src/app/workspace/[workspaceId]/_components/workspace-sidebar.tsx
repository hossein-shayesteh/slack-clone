"use client";

import { AlertTriangle, Loader } from "lucide-react";

import { useCurrentMember } from "@/src/features/members/api/use-current-member";
import { useGetWorkspace } from "@/src/features/workspace/api/use-get-workspace";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";

import WorkspaceHeader from "@/src/app/workspace/[workspaceId]/_components/workspace-header";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const { data: member, isLoading: memberLoading } =
    useCurrentMember(workspaceId);

  const { data: workspace, isLoading: workspaceLoading } =
    useGetWorkspace(workspaceId);

  if (workspaceLoading || memberLoading)
    return (
      <div
        className={
          "flex h-full flex-col items-center justify-center bg-[#5e2c5f]"
        }
      >
        <Loader className={"size-5 animate-spin text-white"} />
      </div>
    );

  if (!member || !workspace)
    return (
      <div
        className={
          "flex h-full flex-col items-center justify-center gap-y-2 bg-[#5e2c5f]"
        }
      >
        <AlertTriangle className={"size-5 text-white"} />
        <p className={"text-sm text-white"}>Workspace not found.</p>
      </div>
    );

  return (
    <div className={"flex h-full flex-col bg-[#5e2c5f]"}>
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
    </div>
  );
};
export default WorkspaceSidebar;
