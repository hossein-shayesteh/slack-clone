"use client";

import { useEffect, useMemo } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Loader } from "lucide-react";
import VerificationInput from "react-verification-input";

import { useToast } from "@/src/hooks/use-toast";

import { cn } from "@/src/lib/utils";

import { useGetWorkspaceInfo } from "@/src/features/workspace/api/use-get-workspace-info";
import { useJoinWorkspace } from "@/src/features/workspace/api/use-join-workspace";
import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";

import { Button } from "@/src/components/ui/button";

const JoinPage = () => {
  const { toast } = useToast();
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const { data: workspace, isLoading: workspaceLoading } =
    useGetWorkspaceInfo(workspaceId);

  const { mutate: joinWorkspace, isPending } = useJoinWorkspace();
  const isMember = useMemo(() => workspace?.isMember, [workspace?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleComplete = async (value: string) => {
    await joinWorkspace(
      { id: workspaceId, joinCode: value },
      {
        onSuccess: (data) => {
          router.replace(`/workspace/${data?._id}`);
          toast({ description: "Workspace joined successfully" });
        },
        onError: () => {
          toast({ description: "Failed to join workspace" });
        },
      },
    );
  };

  if (workspaceLoading)
    return (
      <div className={"flex h-full items-center justify-center"}>
        <Loader className={"size-6 animate-spin text-muted-foreground"} />
      </div>
    );

  return (
    <div
      className={
        "flex h-full flex-col items-center justify-center gap-y-8 rounded-lg bg-white p-8 shadow-md"
      }
    >
      <Image src={"/hashtag.svg"} alt={"Logo"} width={60} height={60} />
      <div
        className={"flex max-w-md flex-col items-center justify-center gap-y-4"}
      >
        <div className={"flex flex-col items-center justify-center gap-y-2"}>
          <h1 className={"text-2xl font-bold"}>Join {workspace?.name}</h1>
          <p className={"text-muted-foreground"}>
            Enter the workspace code to join
          </p>
        </div>
        <span className={"bg-white text-black"}></span>
        <VerificationInput
          onComplete={handleComplete}
          autoFocus
          length={6}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed",
            ),
            character:
              "flex h-auto items-center justify-center rounded-md border border-gray-300 text-lg font-medium uppercase text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
        />
      </div>
      <div className={"flex gap-x-4"}>
        <Button asChild variant={"outline"} size={"lg"}>
          <Link href={"/"}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};
export default JoinPage;
