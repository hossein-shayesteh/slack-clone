"use client";

import { useRouter } from "next/navigation";

import { Loader, Plus } from "lucide-react";

import { useGetWorkspace } from "@/src/features/workspace/api/use-get-workspace";
import { useGetWorkspaces } from "@/src/features/workspace/api/use-get-workspaces";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/src/features/workspace/store/use-create-workspace-modal";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

const WorkspaceSwitcher = () => {
  const router = useRouter();

  const [_openCreateWorkspaceModal, setOpenCreateWorkspaceModal] =
    useCreateWorkspaceModal();

  const workspaceId = useWorkspaceId();

  const { data: workspaces } = useGetWorkspaces();
  const { data: workspace, isLoading: isWorkspaceLoading } =
    useGetWorkspace(workspaceId);

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={
            "relative size-9 overflow-hidden bg-[#ABABAD] text-xl font-semibold text-slate-800 hover:bg-[#ABABAD]/80"
          }
        >
          {isWorkspaceLoading ? (
            <Loader className={"size-5 shrink-0 animate-spin"} />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={"bottom"} align={"start"} className={"w-64"}>
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className={
            "flex cursor-pointer flex-col items-start justify-start capitalize"
          }
        >
          <p className={"truncate"}>{workspace?.name}</p>
          <span className={"text-xs text-muted-foreground"}>
            Active workspace
          </span>
        </DropdownMenuItem>
        {filteredWorkspaces &&
          filteredWorkspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace?._id}
              className={"cursor-pointer truncate capitalize"}
              onClick={() => router.push(`/workspace/${workspace?._id}`)}
            >
              <div
                className={
                  "mr-2 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#616061] text-lg font-semibold text-white"
                }
              >
                {workspace?.name.charAt(0).toUpperCase()}
              </div>
              <p className={"truncate"}>{workspace?.name}</p>
            </DropdownMenuItem>
          ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={"cursor-pointer"}
          onClick={() => setOpenCreateWorkspaceModal(true)}
        >
          <div
            className={
              "mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-[#f2f2f2] text-lg font-semibold text-slate-800"
            }
          >
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default WorkspaceSwitcher;
