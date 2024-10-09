"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Loader2, LogOut } from "lucide-react";

import { useCurrentUser } from "@/src/features/auth/api/use-current-user";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

const UserButton = () => {
  const { signOut } = useAuthActions();
  const { data, isLoading } = useCurrentUser();

  if (isLoading)
    return <Loader2 className={"size-4 animate-spin text-muted-foreground"} />;
  if (!data) return null;

  const { image, name } = data;
  const avatarFallback = name!.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={"relative outline-none"}>
        <Avatar className={"size-10 transition hover:opacity-75"}>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={"center"} side={"right"} className={"w-60"}>
        <DropdownMenuItem className={"h-10"} onClick={() => void signOut()}>
          <LogOut className={"mr-2 size-4"} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserButton;
