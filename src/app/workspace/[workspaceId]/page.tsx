"use client";

import { useEffect, useMemo } from "react";

import { useRouter } from "next/navigation";

import { Loader, TriangleAlert } from "lucide-react";

import { useGetChannels } from "@/src/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/src/features/channels/store/use-create-channel-modal";
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

  const channelId = useMemo(() => channels?.[0]._id, [channels]);

  useEffect(() => {
    if (workspaceLoading || channelsLoading || !workspace) return;

    if (channelId)
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    else if (!open) setOpen(true);
  }, [
    channelId,
    channelsLoading,
    open,
    router,
    setOpen,
    workspace,
    workspaceId,
    workspaceLoading,
  ]);

  if (workspaceLoading || channelsLoading)
    return (
      <div
        className={
          "flex h-full flex-1 flex-col items-center justify-center gap-2"
        }
      >
        <Loader className={"size-6 animate-spin text-muted-foreground"} />
      </div>
    );

  if (!workspace)
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

  return null;
};
export default WorkspaceIdPage;
