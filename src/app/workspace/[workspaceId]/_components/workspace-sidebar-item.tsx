import Link from "next/link";

import { type VariantProps, cva } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

import { cn } from "@/src/lib/utils";

import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";

import { Button } from "@/src/components/ui/button";

const workspaceSidebarItemVariant = cva(
  "flex h-7 items-center justify-start gap-1.5 overflow-hidden px-[18px] text-sm font-normal",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "bg-white/90 text-[#481349] hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface WorkspaceSidebarItemProps {
  id: string;
  label: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof workspaceSidebarItemVariant>["variant"];
}

const WorkspaceSidebarItem = ({
  id,
  label,
  variant,
  icon: Icon,
}: WorkspaceSidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      asChild
      size={"sm"}
      variant={"transparent"}
      className={cn(workspaceSidebarItemVariant({ variant }))}
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className={"mr-1 size-3.5 shrink-0"} />
        <span className={"truncate text-sm"}>{label}</span>
      </Link>
    </Button>
  );
};
export default WorkspaceSidebarItem;
