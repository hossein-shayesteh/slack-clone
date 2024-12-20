"use client";

import { useEffect, useMemo } from "react";

import { useRouter } from "next/navigation";

import { Loader, TriangleAlert } from "lucide-react";

import { useGetChannels } from "@/src/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/src/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/src/features/members/api/use-current-member";
import { useGetWorkspace } from "@/src/features/workspace/api/use-get-workspace";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";

const WorkspaceIdPage = () => {
  const [open, setOpen] = useCreateChannelModal();

  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const { data: workspace, isLoading: workspaceLoading } =
    useGetWorkspace(workspaceId);
  const { data: channels, isLoading: channelsLoading } =
    useGetChannels(workspaceId);
  const { data: member, isLoading: memberIsLoading } =
    useCurrentMember(workspaceId);

  const channelId = useMemo(() => channels?.[0]._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member]);

  useEffect(() => {
    if (workspaceLoading || channelsLoading || !member || !workspace) return;

    if (channelId)
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    else if (!open && isAdmin) setOpen(true);
  }, [
    channelId,
    channelsLoading,
    isAdmin,
    member,
    open,
    router,
    setOpen,
    workspace,
    workspaceId,
    workspaceLoading,
  ]);

  if (workspaceLoading || channelsLoading || memberIsLoading)
    return (
      <div
        className={
          "flex h-full flex-1 flex-col items-center justify-center gap-2"
        }
      >
        <Loader className={"size-6 animate-spin text-muted-foreground"} />
      </div>
    );

  if (!workspace || !member)
    return (
      <div
        className={
          "flex h-full flex-1 flex-col items-center justify-center gap-2"
        }
      >
        <TriangleAlert className={"size-6 text-muted-foreground"} />
        <span className={"text-sm text-muted-foreground"}>
          Workspace not found.
        </span>
      </div>
    );

  return (
    <div
      className={
        "flex h-full flex-1 flex-col items-center justify-center gap-2"
      }
    >
      <TriangleAlert className={"size-6 text-muted-foreground"} />
      <span className={"text-sm text-muted-foreground"}>No channel found.</span>
    </div>
  );
};
export default WorkspaceIdPage;
