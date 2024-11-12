import Link from "next/link";

import { Id } from "@/convex/_generated/dataModel";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/src/lib/utils";

import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";

const memberItemVariant = cva(
  "flex h-7 items-center justify-start gap-1.5 overflow-hidden px-4 text-sm font-normal",
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

interface MemberItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof memberItemVariant>["variant"];
}

const MemberItem = ({
  id,
  image,
  label = "Member",
  variant,
}: MemberItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = label?.charAt(0).toUpperCase();

  return (
    <Button
      asChild
      size={"sm"}
      variant={"transparent"}
      className={cn(memberItemVariant({ variant }))}
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className={"mr-1 size-5 rounded-md"}>
          <AvatarImage className={"rounded-md"} src={image} />
          <AvatarFallback
            className={"rounded-md bg-sky-500 text-xs text-white"}
          >
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className={"truncate text-sm"}>{label}</span>
      </Link>
    </Button>
  );
};
export default MemberItem;
