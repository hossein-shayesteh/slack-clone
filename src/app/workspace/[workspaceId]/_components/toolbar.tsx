"use client";

import { Info, Search } from "lucide-react";

import { useGetWorkspace } from "@/src/features/workspace/api/use-get-workspace";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";

import { Button } from "@/src/components/ui/button";

const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace(workspaceId);

  return (
    <div
      className={"flex h-10 items-center justify-between bg-[#481349] p-1.5"}
    >
      <div className={"flex-1"} />
      <div className={"min-w-[280px] max-w-[642px] shrink grow-[2]"}>
        <Button
          size={"sm"}
          className={
            "flex h-7 w-full justify-start bg-accent/25 px-2 hover:bg-accent/25"
          }
        >
          <Search className={"mr-2 size-4 text-white"} />
          <span className={"text-xs text-white"}>
            Search {data?.name} workspace
          </span>
        </Button>
      </div>
      <div className={"ml-auto flex flex-1 items-center justify-end"}>
        <Button variant={"transparent"} size={"iconSm"}>
          <Info className={"size-4 text-white"} />
        </Button>
      </div>
    </div>
  );
};
export default Toolbar;
