import React from "react";

import { PlusIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";

import { cn } from "@/src/lib/utils";

import Hint from "@/src/components/shared/hint";
import { Button } from "@/src/components/ui/button";

interface WorkspaceSectionProps {
  hint: string;
  label: string;
  onNew?: () => void;
  children: React.ReactNode;
}

const WorkspaceSection = ({
  hint,
  label,
  onNew,
  children,
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(false);

  return (
    <div className={"mt-3 flex flex-col px-2"}>
      <div className={"group flex items-center px-3.5"}>
        <Button
          variant={"transparent"}
          onClick={toggle}
          className={"size-6 shrink-0 p-0.5 text-sm text-[#f9edffcc]"}
        >
          <FaCaretDown
            className={cn("size-4 transition", on && "-rotate-90")}
          />
        </Button>
        <Button
          variant={"transparent"}
          size={"sm"}
          className={
            "group flex h-[28px] items-center justify-start overflow-hidden px-1.5 text-sm text-[#f9edffcc]"
          }
        >
          <span className={"truncate"}>{label}</span>
        </Button>
        {onNew && (
          <Hint label={hint} align={"center"} side={"top"}>
            <Button
              onClick={onNew}
              size={"iconSm"}
              className={
                "ml-auto size-6 shrink-0 p-0.5 text-sm text-[#f9edffcc] opacity-0 transition group-hover:opacity-100"
              }
              variant={"transparent"}
            >
              <PlusIcon className={"size-5"} />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
};
export default WorkspaceSection;
