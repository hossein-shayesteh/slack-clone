"use client";

import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";

import { useGetChannels } from "@/src/features/channels/api/use-get-channels";
import { useChannelId } from "@/src/features/channels/hooks/use-channel-id";
import { useCreateChannelModal } from "@/src/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/src/features/members/api/use-current-member";
import { useGetMembers } from "@/src/features/members/api/use-get-members";
import { useGetWorkspace } from "@/src/features/workspace/api/use-get-workspace";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";

import MemberItem from "@/src/app/workspace/[workspaceId]/_components/member-item";
import WorkspaceHeader from "@/src/app/workspace/[workspaceId]/_components/workspace-header";
import WorkspaceSection from "@/src/app/workspace/[workspaceId]/_components/workspace-section";
import WorkspaceSidebarItem from "@/src/app/workspace/[workspaceId]/_components/workspace-sidebar-item";

const WorkspaceSidebar = () => {
  const [_open, setOpen] = useCreateChannelModal();

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

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
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((channel) => (
          <WorkspaceSidebarItem
            icon={HashIcon}
            id={channel._id}
            key={channel._id}
            label={channel.name}
            variant={channel._id === channelId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label={"Direct Messages"}
        hint={"New direct messages"}
        onNew={() => {}}
      >
        {members?.map((member) => (
          <MemberItem
            key={member._id}
            id={member._id}
            label={member.user.name}
            image={member.user.image}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
export default WorkspaceSidebar;
