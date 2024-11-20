import { Doc } from "@/convex/_generated/dataModel";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";

import { useInviteModal } from "@/src/features/workspace/store/use-invite-modal";
import { useWorkspacePreferencesModal } from "@/src/features/workspace/store/use-workspace-preferences-modal";

import Hint from "@/src/components/shared/hint";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
  const [_openWorkspacePreferencesModal, setOpenWorkspacePreferencesModal] =
    useWorkspacePreferencesModal();
  const [_openInviteModal, setOpenInviteModal] = useInviteModal();

  return (
    <div className={"flex h-[49px] items-center justify-between gap-0.5 px-4"}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={"w-auto overflow-hidden p-1.5 text-lg font-semibold"}
            variant={"transparent"}
            size={"sm"}
          >
            <span className={"truncate"}>{workspace.name}</span>
            <ChevronDown className={"ml-1 size-4 shrink-0"} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side={"bottom"} align={"start"} className={"w-64"}>
          <DropdownMenuItem className={"cursor-pointer capitalize"}>
            <div
              className={
                "relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-[#616061] text-xl font-semibold text-white"
              }
            >
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div className={"flex flex-col items-start"}>
              <p className={"font-bold"}>{workspace.name}</p>
              <p className={"text-xs text-muted-foreground"}>
                Active workspace
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isAdmin && (
            <>
              <DropdownMenuItem
                className={"cursor-pointer py-2"}
                onClick={() => setOpenInviteModal(true)}
              >
                Invite people to {workspace.name}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={"cursor-pointer py-2"}
                onClick={() => setOpenWorkspacePreferencesModal(true)}
              >
                Preferences
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className={"flex items-center gap-0.5"}>
        <Hint label={"Search"} side={"bottom"}>
          <Button variant={"transparent"} size={"iconSm"}>
            <ListFilter className={"size-4"} />
          </Button>
        </Hint>
        <Hint label={"New message"} side={"bottom"}>
          <Button variant={"transparent"} size={"iconSm"}>
            <SquarePen className={"size-4"} />
          </Button>
        </Hint>
      </div>
    </div>
  );
};
export default WorkspaceHeader;
