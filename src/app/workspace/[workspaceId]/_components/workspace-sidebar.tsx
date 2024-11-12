"use client";

import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";

import { useGetChannels } from "@/src/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/src/features/members/api/use-current-member";
import { useGetMembers } from "@/src/features/members/api/use-get-members";
import { useGetWorkspace } from "@/src/features/workspace/api/use-get-workspace";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";

import WorkspaceHeader from "@/src/app/workspace/[workspaceId]/_components/workspace-header";
import WorkspaceSection from "@/src/app/workspace/[workspaceId]/_components/workspace-section";
import WorkspaceSidebarItem from "@/src/app/workspace/[workspaceId]/_components/workspace-sidebar-item";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const { data: member, isLoading: memberLoading } =
    useCurrentMember(workspaceId);
  const { data: workspace, isLoading: workspaceLoading } =
    useGetWorkspace(workspaceId);

  const { data: channels } = useGetChannels(workspaceId);
  const { data: members } = useGetMembers(workspaceId);

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
      <div className={"mt-3 flex flex-col px-2"}>
        <WorkspaceSidebarItem
          label={"Threads"}
          icon={MessageSquareText}
          id={"threads"}
        />
        <WorkspaceSidebarItem
          label={"Draft & sent"}
          icon={SendHorizonal}
          id={"drafts"}
        />
      </div>
      <WorkspaceSection
        label={"Channels"}
        hint={"New channel"}
        onNew={() => {}}
      >
        {channels?.map((channel) => (
          <WorkspaceSidebarItem
            key={channel._id}
            label={channel.name}
            icon={HashIcon}
            id={channel._id}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
export default WorkspaceSidebar;
