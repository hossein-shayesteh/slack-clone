"use client";

import Image from "next/image";
import Link from "next/link";

import VerificationInput from "react-verification-input";

import { useWorkspaceId } from "@/src/features/workspace/hooks/use-workspace-id";

import { Button } from "@/src/components/ui/button";

const JoinPage = () => {
  const workspaceId = useWorkspaceId();

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
          <h1 className={"text-2xl font-bold"}>Join workspace</h1>
          <p className={"text-muted-foreground"}>
            Enter the workspace code to join
          </p>
        </div>
        <span className={"bg-white text-black"}></span>
        <VerificationInput
          autoFocus
          length={6}
          classNames={{
            container: "flex gap-x-2",
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
